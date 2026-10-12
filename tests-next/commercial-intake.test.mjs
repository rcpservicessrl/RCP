import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { pathToFileURL } from "node:url";
import path from "node:path";
import { test, after } from "node:test";
import { campaignFromUrl, normalizeCampaign, normalizeOffer, parseCampaignJson, detailedCrmProblem } from "../lib/commercial-intake.ts";
const hooks = registerHooks({ resolve(specifier, context, next) { return next(specifier.startsWith("@/") ? pathToFileURL(path.join(process.cwd(), `${specifier.slice(2)}.ts`)).href : specifier, context); } });
const deploymentEnvironment = process.env.RCP_DEPLOYMENT_ENV;
delete process.env.RCP_DEPLOYMENT_ENV;
after(() => {
 hooks.deregister();
 if (deploymentEnvironment === undefined) delete process.env.RCP_DEPLOYMENT_ENV;
 else process.env.RCP_DEPLOYMENT_ENV = deploymentEnvironment;
});
const { POST } = await import("../app/api/inquiries/route.ts");
let sequence=0;
function request(payload, key=`commercial-test-${++sequence}`) { return new Request("https://rcp.services/api/inquiries", {method:"POST", headers:{origin:"https://rcp.services","content-type":"application/json","idempotency-key":key,"x-forwarded-for":`local-${++sequence}`},body:JSON.stringify(payload)}); }
function mockEnv(t, key, value) { const previous=process.env[key];process.env[key]=value;t.after(()=>{if(previous===undefined)delete process.env[key];else process.env[key]=previous;}); }
const minimal={intakeMode:"brief",offer:"WEB",name:"Local Test",company:"Synthetic business",email:"local@example.test",contactPreference:"email",consent:"true",locale:"es"};
test("campaign context bounds identifiers and never retains query, referrer or contact fields",()=> {
 assert.deepEqual(campaignFromUrl(new URL("https://rcp.services/?utm_source=meta&utm_campaign=web_sep&email=private@example.test")),{utm_source:"meta",utm_campaign:"web_sep",landingPath:"/"});
 assert.deepEqual(normalizeCampaign({utm_source:"private@example.test",utm_medium:"hello world",landingPath:"/contact?email=secret",email:"secret"}),{});
 assert.deepEqual(parseCampaignJson("[]"),{}); assert.deepEqual(parseCampaignJson("{"),{});
 assert.equal(normalizeOffer("e-CF"),undefined); assert.equal(normalizeOffer(["WEB"]),undefined);
});
test("brief email delivery preserves offer and campaign without requiring long answers",async t=>{
 mockEnv(t, "RESEND_API_KEY","local-synthetic"); mockEnv(t, "RCP_INQUIRY_EMAIL_FROM","local@example.test"); mockEnv(t, "RCP_INQUIRY_EMAIL_TO","team@example.test");mockEnv(t, "RCP_INTAKE_DELIVERY_MODE","email");
 let delivered;
 t.mock.method(globalThis,"fetch",async (url,init)=>{assert.equal(url,"https://api.resend.com/emails");delivered=JSON.parse(init.body);return Response.json({id:"local-provider"});});
 const response=await POST(request({...minimal,campaign:JSON.stringify({utm_campaign:"web_sep",landingPath:"/"})}));
 assert.equal(response.status,202);assert.equal((await response.json()).recorded,true);
 assert.match(delivered.text,/Offer: WEB/);assert.match(delivered.text,/utm_campaign: web_sep/);assert.match(delivered.text,/Not supplied/);
});
test("brief requests enforce consent, offer, contact preference and diagnosis requirements before delivery",async t=>{
 let calls=0;t.mock.method(globalThis,"fetch",async ()=>{calls++;throw Error("unexpected");});
 for(const payload of [{...minimal,consent:false},{...minimal,offer:"ECF"},{...minimal,email:"",phone:""},{...minimal,contactPreference:"whatsapp"},{...minimal,email:"invalid"},{...minimal,phone:"123"},{...minimal,intakeMode:"detailed"},{...minimal,intakeMode:"unknown"}]) assert.equal((await POST(request(payload))).status,400);
 assert.equal(calls,0);
 const bot=await POST(request({...minimal,website:"bot"}));assert.equal(bot.status,202);assert.equal((await bot.json()).recorded,false);
});
test("provider failure never confirms a brief request",async t=>{
 mockEnv(t, "RESEND_API_KEY","local");mockEnv(t, "RCP_INQUIRY_EMAIL_FROM","local@example.test");mockEnv(t, "RCP_INQUIRY_EMAIL_TO","team@example.test");mockEnv(t, "RCP_INTAKE_DELIVERY_MODE","email");
 t.mock.method(globalThis,"fetch",async()=>Response.json({error:"unavailable"},{status:503}));
 const response=await POST(request(minimal));assert.equal(response.status,503);assert.equal((await response.json()).recorded,false);
});
test("CRM receives a backward-compatible assessment with explicit pending answers and commercial context",async t=>{
 for(const [key,value] of Object.entries({RCP_INTAKE_DELIVERY_MODE:"crm",RCP_CRM_INGEST_URL:"https://crm.example.test/api/intakes",RCP_CRM_INGEST_TOKEN:"local",RCP_CRM_HMAC_SECRET:"local",RCP_CRM_ALLOWED_HOSTS:"crm.example.test"}))mockEnv(t, key,value);
 let record;
 t.mock.method(globalThis,"fetch",async(url,init)=>{assert.equal(url,"https://crm.example.test/api/intakes");record=JSON.parse(init.body);assert.match(init.headers["X-RCP-Signature"],/^sha256=/);return Response.json({recorded:true,reference:record.reference,stage:"evaluation_requested"});});
 const response=await POST(request({...minimal,offer:"SOFTWARE",campaign:JSON.stringify({utm_source:"meta"})}));assert.equal(response.status,202);
 assert.match(record.problem,/pendiente de evaluar/);assert.match(record.problem,/Offer: SOFTWARE/);assert.match(record.problem,/utm_source: meta/);assert.ok(record.expectedOutcome.length>=10);
 assert.equal(record.source,"rcp.services");assert.equal(record.type,"initial_assessment_request");assert.equal(record.journeyStage,"initial_evaluation_request");assert.equal(record.next,"initial_evaluation_review");
});

test("detailed CRM attribution retains all answers or rejects before provider delivery",async t=>{
 for(const [key,value] of Object.entries({RCP_INTAKE_DELIVERY_MODE:"crm",RCP_CRM_INGEST_URL:"https://crm.example.test/api/intakes",RCP_CRM_INGEST_TOKEN:"local",RCP_CRM_HMAC_SECRET:"local",RCP_CRM_ALLOWED_HOSTS:"crm.example.test"}))mockEnv(t,key,value);
 const detailed={...minimal,intakeMode:"detailed",offer:"SOFTWARE",need:"ordenar",sector:"servicios",problem:"This is the full workflow requiring evaluation.",expectedOutcome:"Complete expected outcome retained exactly.",campaign:JSON.stringify({utm_source:"meta",utm_campaign:"qa_rcp_phase1",landingPath:"/software-a-la-medida"})};
 let records=[];
 t.mock.method(globalThis,"fetch",async(url,init)=>{const record=JSON.parse(init.body);records.push(record);return Response.json({recorded:true,reference:record.reference,stage:"evaluation_requested"});});
 assert.equal((await POST(request(detailed))).status,202);
 assert.equal(records.length,1);
 assert.ok(records[0].problem.endsWith(detailed.problem));
 assert.match(records[0].problem,/Offer: SOFTWARE/);assert.match(records[0].problem,/utm_campaign: qa_rcp_phase1/);assert.match(records[0].problem,/landingPath: \/software-a-la-medida/);
 assert.equal(records[0].expectedOutcome,detailed.expectedOutcome);assert.ok(records[0].problem.length<=1000);
 const capacity=await POST(request({...detailed,problem:"x".repeat(1000)}));
 assert.equal(capacity.status,503);const result=await capacity.json();assert.equal(result.recorded,false);assert.equal(result.message,"crm_attribution_capacity_exceeded");assert.equal(records.length,1);
 const handoff=new URL(result.handoffUrl).searchParams.get("text");assert.match(handoff,/Offer: SOFTWARE/);assert.match(handoff,/utm_campaign: qa_rcp_phase1/);
 const context={utm_campaign:"qa"};const overhead=detailedCrmProblem("", "WEB",context).length;
 assert.equal(detailedCrmProblem("x".repeat(1000-overhead),"WEB",context).length,1000);
 assert.equal(detailedCrmProblem("x".repeat(1001-overhead),"WEB",context),null);
 assert.equal(detailedCrmProblem("x".repeat(1000),undefined,{}),"x".repeat(1000));
});
test("detailed email delivery keeps maximum-length answers and campaign without a legacy capacity reduction",async t=>{
 for(const [key,value] of Object.entries({RCP_INTAKE_DELIVERY_MODE:"email",RESEND_API_KEY:"local",RCP_INQUIRY_EMAIL_FROM:"local@example.test",RCP_INQUIRY_EMAIL_TO:"team@example.test"}))mockEnv(t,key,value);
 const problem="p".repeat(1000),expectedOutcome="e".repeat(600);let delivered;
 t.mock.method(globalThis,"fetch",async(url,init)=>{delivered=JSON.parse(init.body);return Response.json({id:"local-provider"});});
 const response=await POST(request({...minimal,intakeMode:"detailed",offer:"SOFTWARE",need:"ordenar",sector:"servicios",problem,expectedOutcome,campaign:JSON.stringify({utm_campaign:"qa_full_diagnosis"})}));
 assert.equal(response.status,202);assert.ok(delivered.text.includes(problem));assert.ok(delivered.text.includes(expectedOutcome));assert.match(delivered.text,/Offer: SOFTWARE/);assert.match(delivered.text,/utm_campaign: qa_full_diagnosis/);
});
