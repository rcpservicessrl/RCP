import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (relativePath) => readFile(path.join(root, relativePath), "utf8").then((source) => source.replace(/\r\n/g, "\n"));

function quotedProperty(source, property) {
  const match = source.match(new RegExp(`\\b${property}:\\s*"([^"]+)"`));
  assert.ok(match, `missing quoted property ${property}`);
  return match[1];
}

function extractCalls(source, callee) {
  const calls = [];
  const needle = `${callee}(`;
  let cursor = 0;

  while ((cursor = source.indexOf(needle, cursor)) !== -1) {
    const start = cursor;
    let depth = 0;
    let quote = "";
    let escaped = false;

    for (let index = cursor + callee.length; index < source.length; index += 1) {
      const character = source[index];

      if (quote) {
        if (escaped) escaped = false;
        else if (character === "\\") escaped = true;
        else if (character === quote) quote = "";
        continue;
      }

      if (character === '"' || character === "'" || character === "`") {
        quote = character;
      } else if (character === "(") {
        depth += 1;
      } else if (character === ")") {
        depth -= 1;
        if (depth === 0) {
          calls.push(source.slice(start, index + 1));
          cursor = index + 1;
          break;
        }
      }
    }

    if (cursor === start) cursor += needle.length;
  }

  return calls;
}

test("homepage locks the approved human positioning and headline", async () => {
  const home = await read("components/home-experience.tsx");
  const spanishCopy = home.slice(home.indexOf("  es: {"), home.indexOf("  en: {"));
  const englishCopy = home.slice(home.indexOf("  en: {"), home.indexOf("};\n\nconst sceneByNeed"));
  const headline = `${quotedProperty(spanishCopy, "h1Before")} ${quotedProperty(spanishCopy, "h1Accent")}`;
  const englishHeadline = `${quotedProperty(englishCopy, "h1Before")} ${quotedProperty(englishCopy, "h1Accent")}`;

  assert.equal(headline, "Le damos nuevo impulso a tu negocio.");
  assert.equal(englishHeadline, "We give your business new momentum.");
  assert.doesNotMatch(headline, /corazón/i);
  assert.doesNotMatch(englishHeadline, /heart/i);
  assert.match(quotedProperty(spanishCopy, "problemText"), /El corazón de tu negocio/i);
  assert.notEqual(headline, "Le damos un nuevo impulso al corazón de tu negocio.");
  assert.notEqual(headline, "Renovamos el corazón de tu empresa para que crezca con dirección.");

  const publicPositioning = (await Promise.all([
    "package.json",
    "app/layout.tsx",
    "app/page.tsx",
    "app/en/page.tsx",
    "app/manifest.ts",
    "app/llms.txt/route.ts",
    "components/home-experience.tsx",
    "components/editorial-page.tsx",
  ].map(read))).join("\n");

  assert.doesNotMatch(publicPositioning, /firma de transformaci[oó]n empresarial/i);
  assert.doesNotMatch(publicPositioning, /business transformation firm/i);
  assert.doesNotMatch(publicPositioning, /le damos un nuevo impulso al corazón de tu negocio/i);
  assert.doesNotMatch(publicPositioning, /renovamos el coraz[oó]n de tu empresa para que crezca con direcci[oó]n/i);
});

test("brand accent text remains readable on light surfaces", async () => {
  const [globalStyles, diagnosisStyles, specialistStyles] = await Promise.all([
    read("app/globals.css"),
    read("components/diagnosis-page.module.css"),
    read("components/specialist-application-page.module.css"),
  ]);

  assert.match(globalStyles, /--amber-text:\s*#fcb53f/);
  assert.match(globalStyles, /html\[data-theme="light"\][\s\S]*?--amber-text:\s*#7a4a00/);
  assert.match(globalStyles, /html\[data-theme="light"\][\s\S]*?--green-text:\s*#3f6100/);
  assert.match(globalStyles, /\.section-eyebrow,[\s\S]*?color:\s*var\(--amber-text\)/);
  assert.match(globalStyles, /\.hero h1 em \{ color: var\(--amber-text\)/);
  assert.match(diagnosisStyles, /\.steps span \{\s*color: var\(--amber-text\)/);
  assert.match(diagnosisStyles, /\.stageGrid span \{\s*color: var\(--amber-text\)/);
  assert.match(specialistStyles, /\.eyebrow \{\s*color: var\(--amber-text\)/);
  assert.match(specialistStyles, /\.boundaryCard > strong \{\s*color: var\(--amber-text\)/);
});

test("the active RCP method uses action and outcome without legacy fields", async () => {
  const [content, types, home, diagnosisPage] = await Promise.all([
    read("lib/content.ts"),
    read("lib/types.ts"),
    read("components/home-experience.tsx"),
    read("components/diagnosis-page.tsx"),
  ]);
  const methodMatch = content.match(/export const methodSteps:[\s\S]*?=\s*\[([\s\S]*?)\n\];/);
  assert.ok(methodMatch, "methodSteps block was not found");
  const method = methodMatch[1];
  const ids = [...method.matchAll(/\bid:\s*"([^"]+)"/g)].map((match) => match[1]);

  assert.deepEqual(ids.slice(0, 4), ["escuchar", "diagnosticar", "disenar", "asignar"]);
  assert.equal([...method.matchAll(/\baction:\s*lt\(/g)].length, ids.length);
  assert.equal([...method.matchAll(/\boutcome:\s*lt\(/g)].length, ids.length);
  assert.doesNotMatch(method, /\bclientReceives\s*:|\bevidence\s*:/);

  assert.match(types, /interface MethodStep[\s\S]*?action:\s*LocalText;[\s\S]*?outcome:\s*LocalText;/);
  assert.doesNotMatch(types.match(/interface MethodStep[\s\S]*?\n}/)?.[0] ?? "", /\bclientReceives\b|\bevidence\b/);
  assert.match(home, /selectedMethod\.action/);
  assert.match(home, /selectedMethod\.outcome/);
  assert.match(diagnosisPage, /step\.action/);
  assert.match(diagnosisPage, /step\.outcome/);
  for (const component of [home, diagnosisPage]) {
    assert.doesNotMatch(component, /\bclientReceives\b|\.(?:clientReceives|evidence)\b/);
  }
});

test("public catalog filters expose only the three pillars and Todo", async () => {
  const explorer = await read("components/catalog-explorer.tsx");
  const filterMatch = explorer.match(/\(\[([^\]]+)\]\s+as Filter\[\]\)\.map/);
  assert.ok(filterMatch, "public catalog filter list was not found");
  const filterIds = [...filterMatch[1].matchAll(/"([^"]+)"/g)].map((match) => match[1]);

  assert.deepEqual(filterIds, ["all", "renovacion", "consultoria", "publicidad"]);
  assert.match(
    explorer,
    /es:\s*{\s*all:\s*"Todo",\s*renovacion:\s*"Renovaci[oó]n",\s*consultoria:\s*"Consultor[ií]a",\s*publicidad:\s*"Publicidad"\s*}/,
  );
});

test("every physical catalog item remains inside Publicidad", async () => {
  const content = await read("lib/content.ts");
  const physicalItems = extractCalls(content, "item").filter((call) => /\bkind:\s*"physical"/.test(call));

  assert.ok(physicalItems.length > 0, "expected at least one physical advertising item");
  for (const item of physicalItems) {
    const identity = item.match(/^item\(\s*"([^"]+)"\s*,\s*"([^"]+)"/);
    assert.ok(identity, `could not read catalog identity from ${item.slice(0, 80)}`);
    assert.equal(identity[2], "publicidad", `${identity[1]} must stay under Publicidad`);
  }

  assert.match(content, /id:\s*"publicidad"[\s\S]*?eyebrow:\s*lt\("Publicidad 360"/);
});

test("the pilot accepts an inquiry only after the selected provider confirms delivery", async () => {
  const [route, delivery] = await Promise.all([
    read("app/api/inquiries/route.ts"),
    read("lib/server/delivery.ts"),
  ]);

  assert.match(route, /resolveDeliveryMode\(\) === "crm"/);
  assert.match(route, /if \(!confirmation \|\| confirmation\.reference !== reference\)[^\n]*accepted: false, recorded: false/);
  assert.match(route, /const delivery = await deliverEmail/);
  assert.match(route, /if \(!delivery\.accepted\)[^\n]*accepted: false, recorded: false/);
  assert.match(route, /return Response\.json\(\{ accepted: true, recorded: true, notified: true/);
  assert.match(delivery, /response\.ok && providerId\.length > 0/);
  assert.match(delivery, /"Idempotency-Key": input\.idempotencyKey/);
  assert.match(delivery, /X-RCP-Signature/);
  assert.match(delivery, /X-RCP-Timestamp/);
});

test("guided diagnosis has four steps and carries the selected context", async () => {
  const [form, home, diagnosisPage] = await Promise.all([
    read("components/diagnosis-form.tsx"),
    read("components/home-experience.tsx"),
    read("components/diagnosis-page.tsx"),
  ]);
  const spanishLabels = form.match(/es:\s*\[([^\]]+)\]/);
  assert.ok(spanishLabels, "Spanish diagnosis steps were not found");
  const labels = [...spanishLabels[1].matchAll(/"([^"]+)"/g)].map((match) => match[1]);

  assert.equal(labels.length, 4);
  assert.match(form, /const \[step, setStep\] = useState\(1\)/);
  assert.match(form, /const next = Math\.min\(4, step \+ 1\)/);
  assert.match(form, /setStep\(next\)/);
  assert.match(form, /guided && step < 4/);
  assert.match(form, /Paso"\s*:\s*"Step"}\s*{step}\s*\/ 4/);
  assert.match(form, /aria-current={step === index \+ 1 \? "step" : undefined}/);
  for (let index = 0; index < 4; index += 1) {
    assert.match(form, new RegExp(`fieldsets\\.current\\[${index}\\][^\\n]*hidden=\\{guided && step !== ${index + 1}\\}`));
  }

  assert.match(form, /name="selectedServices" value={selectedServices}/);
  assert.match(form, /name="selectedSolution" value={selectedSolution\?\.id \?\? ""}/);
  assert.match(form, /useState<NeedId \| "">\(initialNeed \?\? ""\)/);
  assert.match(home, /<DiagnosisForm locale={locale} guided initialNeed={activeNeed} \/>/);
  assert.match(diagnosisPage, /<DiagnosisForm locale={locale} selectedServiceIds={selectedServiceIds} selectedCapabilityId={selectedCapabilityId} selectedSolutionId={selectedSolutionId} guided \/>/);
});

test("diagnosis errors preserve form values and a server-provided handoff", async () => {
  const form = await read("components/diagnosis-form.tsx");
  const handoffAssignment = form.indexOf('setHandoffUrl(result.handoffUrl ?? "")');
  const acceptanceGuard = form.indexOf("result.accepted !== true");
  const successState = form.indexOf('setState("success")');
  const reset = form.indexOf("form.reset()");
  const catchStart = form.indexOf("} catch {", reset);
  const catchEnd = form.indexOf("\n    }\n  };", catchStart);

  assert.ok(handoffAssignment >= 0 && handoffAssignment < acceptanceGuard, "handoff must be saved before a rejected response throws");
  assert.ok(acceptanceGuard < successState && successState < reset, "the form may reset only after explicit acceptance");
  assert.equal(form.match(/form\.reset\(\)/g)?.length, 1);
  assert.ok(catchStart > reset && catchEnd > catchStart, "submission error branch was not found");

  const errorBranch = form.slice(catchStart, catchEnd);
  assert.match(errorBranch, /setState\("error"\)/);
  assert.doesNotMatch(errorBranch, /form\.reset\(|setHandoffUrl\(""\)|setStep\(1\)/);
  assert.match(form, /state === "error"[\s\S]*?handoffUrl && <a/);
  assert.match(form, /Tus datos siguen en pantalla/);
});
