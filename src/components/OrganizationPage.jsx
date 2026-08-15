import { Check, FileText, Mail, MapPinned, UserRound } from "lucide-react";
import { CONTACTS, DOCUMENTS, WELCOME_STEPS } from "../data/organization.js";

export function OrganizationPage({ onNotice }) {
  return (
    <div className="page page--organization">
      <header className="organization-heading">
        <div><h1>Organization</h1><p>Contacts, hosting, and administration</p></div>
        <span className="plum-chip" aria-hidden="true">✿ ISLT</span>
      </header>

      <div className="organization-dashboard">
        <section className="organization-content contacts-panel" aria-labelledby="contacts-heading">
          <div className="organization-content__title">
            <span className="organization-icon"><UserRound size={23} aria-hidden="true" /></span>
            <div><h2 id="contacts-heading">Contacts</h2><p>ISLT coordinator and school referents</p></div>
          </div>
          <div className="contacts-list">
            {CONTACTS.map((contact, index) => (
              <a className="contact-row" href={`mailto:${contact.email}`} key={contact.role}>
                <span className="contact-avatar">{index === 0 ? "IS" : contact.school.slice(0, 2)}</span>
                <div><strong>{contact.role}</strong><span>{contact.email}</span></div>
                <Mail size={17} aria-hidden="true" />
              </a>
            ))}
          </div>
        </section>

        <div className="organization-secondary">
          <section className="organization-content" aria-labelledby="welcome-heading">
          <div className="organization-content__title">
            <span className="organization-icon"><MapPinned size={23} aria-hidden="true" /></span>
            <div><h2 id="welcome-heading">How to welcome a game</h2><p>Saturday matchday</p></div>
          </div>
          <ol className="welcome-list">
            {WELCOME_STEPS.map((step) => (
              <li key={`${step.time}-${step.label}`}>
                <time>{step.time}</time>
                <span className="welcome-list__check"><Check size={15} aria-hidden="true" /></span>
                <strong>{step.label}</strong>
              </li>
            ))}
          </ol>
          </section>

          <section className="organization-content documentation-panel" aria-labelledby="documentation-heading">
            <div className="organization-content__title">
              <span className="organization-icon organization-icon--red"><FileText size={23} aria-hidden="true" /></span>
              <div><h2 id="documentation-heading">Documentation</h2><p>PDF library · coming later</p></div>
            </div>
            <div className="document-list">
              {DOCUMENTS.map((document) => (
                <button type="button" key={document.title} onClick={() => onNotice(`${document.title} PDF coming soon.`)}>
                  <FileText size={17} aria-hidden="true" />
                  <span>{document.title}</span>
                  <small>PDF later</small>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
