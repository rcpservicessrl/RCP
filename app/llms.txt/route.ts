const content = `# RCP Services

RCP Services is a business transformation company for small businesses in the Dominican Republic.

Public promise in Spanish: "Le damos nuevo impulso a tu negocio." Heart and pulse language is a secondary RCP narrative; it is not a separate service or a guaranteed outcome.

## Core offer

- Renewal, Consulting and Advertising are the three pillars. 360 Advertising describes how the Advertising pillar brings together digital channels, print, signage and promotional materials.
- Technology is transversal and is selected only when it improves a process, reduces risk or accelerates an outcome.
- RCP 360 Diagnosis is the qualification entry point.
- Software is designed or integrated to fit the client's process; it is not a universal suite.

## Public routes

- https://rcp.services/
- https://rcp.services/servicios
- https://rcp.services/servicios/renovacion
- https://rcp.services/servicios/consultoria
- https://rcp.services/servicios/publicidad
- https://rcp.services/catalogo
- https://rcp.services/soluciones-tecnologicas
- https://rcp.services/software-a-la-medida
- https://rcp.services/facturacion-electronica
- https://rcp.services/como-trabajamos
- https://rcp.services/sectores
- https://rcp.services/diagnostico
- https://rcp.services/contacto
- https://rcp.services/recursos
- https://rcp.services/nosotros
- https://rcp.services/media
- https://rcp.services/especialistas
- https://rcp.services/especialistas/postular
- https://rcp.services/en
- https://rcp.services/en/services
- https://rcp.services/en/services/renewal
- https://rcp.services/en/services/consulting
- https://rcp.services/en/services/advertising
- https://rcp.services/en/catalog
- https://rcp.services/en/technology-solutions
- https://rcp.services/en/custom-software
- https://rcp.services/en/electronic-invoicing
- https://rcp.services/en/how-we-work
- https://rcp.services/en/sectors
- https://rcp.services/en/diagnosis
- https://rcp.services/en/contact
- https://rcp.services/en/resources
- https://rcp.services/en/about
- https://rcp.services/en/media
- https://rcp.services/en/specialists
- https://rcp.services/en/specialists/apply

## Important boundaries

- RCP does not guarantee sales, search rankings, tax outcomes or regulatory acceptance.
- Electronic invoicing is presented as readiness and integration through authorized capability.
- Ownership, infrastructure, support and exit are defined per project.
- Pulso is the official RCP Jaguar Mascot and public guide; it does not issue legal, tax or financial advice.
- The public catalog does not publish rigid prices or process online payments; scope and ownership are defined after qualification.

Contact: info@rcp.services
`;

export function GET() {
  return new Response(content, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=86400" } });
}
