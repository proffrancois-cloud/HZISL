import { FileText, Mail, UserRound } from "lucide-react";
import { CONTACTS, DOCUMENTS } from "../data/organization.js";
import { SCHOOL_BY_ID } from "../data/schools.js";
import { BrandMark } from "./BrandMark.jsx";
import { SchoolLogo } from "./SchoolLogo.jsx";

export function OrganizationPage() {
  return (
    <div className="page page--organization">
      <header className="organization-heading">
        <div><h1>Organization</h1><p>League documents and contacts</p></div>
        <span className="plum-chip" aria-hidden="true">✿ HZISL</span>
      </header>

      <div className="organization-stack">
        <section className="organization-content documentation-panel" aria-labelledby="documentation-heading">
          <div className="organization-content__title">
            <span className="organization-icon organization-icon--red"><FileText size={23} aria-hidden="true" /></span>
            <div><h2 id="documentation-heading">Documentation</h2><p>Handbook, annexes and operational forms</p></div>
          </div>
          <div className="document-list">
            {DOCUMENTS.map((document) => (
              <a href={document.url} download key={document.title}>
                <BrandMark compact />
                <span>{document.title}</span>
                <small>{document.type}</small>
              </a>
            ))}
          </div>
        </section>

        <section className="organization-content contacts-panel" aria-labelledby="contacts-heading">
          <div className="organization-content__title">
            <span className="organization-icon"><UserRound size={23} aria-hidden="true" /></span>
            <div><h2 id="contacts-heading">League contacts</h2><p>Coordinator and six schools</p></div>
          </div>
          <div className="contacts-list">
            {CONTACTS.map((contact, index) => (
              <a className="contact-row" href={`mailto:${contact.email}`} key={contact.role}>
                {index === 0 ? <BrandMark compact /> : <SchoolLogo school={SCHOOL_BY_ID[contact.school]} size="contact" decorative />}
                <div><strong>{contact.role}</strong><span>{contact.email}</span></div>
                <Mail size={17} aria-hidden="true" />
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
