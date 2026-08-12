import Link from "next/link";
import { InteriorShell } from "@/components/interior-shell";
import type { LegalDocumentContent, LegalInline } from "@/lib/legal-content";
import styles from "./legal-document.module.css";

function InlineContent({ content }: { content: LegalInline[] }) {
  return content.map((part, index) => {
    if (typeof part === "string") return part;
    if ("code" in part) return <code key={`${part.code}-${index}`}>{part.code}</code>;
    if (part.href.startsWith("/")) {
      return <Link key={`${part.href}-${index}`} href={part.href}>{part.label}</Link>;
    }
    return <a key={`${part.href}-${index}`} href={part.href}>{part.label}</a>;
  });
}

export function LegalDocument({ content }: { content: LegalDocumentContent }) {
  const language = content.locale === "es" ? "es-DO" : "en";

  return (
    <InteriorShell locale={content.locale}>
      <div className={styles.page} lang={language}>
        <section className={styles.hero} aria-labelledby="legal-title">
          <div className={`container ${styles.heroInner}`}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}><span aria-hidden="true" />{content.badge}</p>
              <h1 id="legal-title">{content.title} <span>{content.accent}</span></h1>
              <p className={styles.summary}>{content.summary}</p>
            </div>
            <aside className={styles.languageCard} aria-label={content.languageLabel}>
              <span>{content.languageLabel}</span>
              <Link href={content.alternate.href} hrefLang={content.alternate.hrefLang}>
                {content.alternate.label}
              </Link>
            </aside>
          </div>
        </section>

        <section className={styles.bodySection}>
          <div className={`container ${styles.bodyGrid}`}>
            <nav className={styles.contents} aria-label={content.contentsLabel}>
              <p>{content.contentsLabel}</p>
              <ol>
                {content.sections.map((section, index) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`}><span>{String(index + 1).padStart(2, "0")}</span>{section.title}</a>
                  </li>
                ))}
              </ol>
            </nav>

            <article className={styles.article}>
              {content.sections.map((section, index) => (
                <section id={section.id} key={section.id}>
                  <header><span>{String(index + 1).padStart(2, "0")}</span><h2>{section.title}</h2></header>
                  {section.paragraphs.map((paragraph, paragraphIndex) => (
                    <p key={`${section.id}-${paragraphIndex}`}><InlineContent content={paragraph} /></p>
                  ))}
                </section>
              ))}
              <div className={styles.documentEnd}>
                <span aria-hidden="true" />
                <p>{content.endLabel}</p>
              </div>
            </article>
          </div>
        </section>
      </div>
    </InteriorShell>
  );
}
