import { useState } from "react";
import { Check, Mail, MapPinned, Phone, UserRound } from "lucide-react";
import { CONTACTS, WELCOME_STEPS } from "../data/organization.js";

export function OrganizationPage() {
  const [activeSection, setActiveSection] = useState("welcome");

  return (
    <div className="page page--organization">
      <header className="organization-heading">
        <h1>Organization</h1>
        <div className="organization-tabs" role="tablist" aria-label="Organization sections">
          <button
            type="button"
            role="tab"
            aria-selected={activeSection === "welcome"}
            onClick={() => setActiveSection("welcome")}
          >
            <span>How to welcome a game</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeSection === "contacts"}
            onClick={() => setActiveSection("contacts")}
          >
            <span>Contacts</span>
          </button>
        </div>
      </header>

      {activeSection === "welcome" ? (
        <section className="organization-content" role="tabpanel" aria-label="How to welcome a game">
          <div className="organization-content__title">
            <span className="organization-icon"><MapPinned size={23} aria-hidden="true" /></span>
            <div><h2>Host checklist</h2><p>Saturday matchday</p></div>
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
      ) : (
        <section className="organization-content" role="tabpanel" aria-label="Contacts">
          <div className="organization-content__title">
            <span className="organization-icon"><UserRound size={23} aria-hidden="true" /></span>
            <div><h2>Contacts</h2><p>Competition team</p></div>
          </div>
          <div className="contacts-list">
            {CONTACTS.map((contact, index) => (
              <div className="contact-row" key={contact.role}>
                <span className="contact-avatar">{index + 1}</span>
                <div><strong>{contact.role}</strong><span>{contact.name}</span></div>
                <span className="contact-detail">
                  {contact.detail.includes("phone") ? <Phone size={15} aria-hidden="true" /> : <Mail size={15} aria-hidden="true" />}
                  {contact.detail}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
