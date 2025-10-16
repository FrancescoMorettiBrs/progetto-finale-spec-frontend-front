import { Link } from "react-router-dom";

export default function InfoPage() {
  return (
    <section className="info-page text-light">
      <div className="container py-5 position-relative">
        <div className="info-stars" aria-hidden="true">
          <span className="star">⭐</span>
          <span className="star">✨</span>
          <span className="star">⚡</span>
        </div>

        <div className="text-center mb-4">
          <div className="display-5 mb-2" role="img" aria-label="Controller">
            🎮
          </div>
          <h1 className="fw-bold info-title">
            Informazioni su <span className="txt-gradient">Game Hub</span>
          </h1>
          <p className="text-opacity-75 mb-0">Un catalogo videogiochi per esplorare, confrontare e salvare i tuoi preferiti.</p>
        </div>

        {/* Missione */}
        <div className="row g-4 align-items-stretch mb-4">
          <div className="col-12 col-lg-6">
            <div className="card h-100 bg-dark-subtle info-card shadow-sm">
              <div className="card-body">
                <h2 className="h5 d-flex align-items-center gap-2">
                  <span>🎯</span> La nostra missione
                </h2>
                <p className="mb-0">
                  Rendere semplice e piacevole scoprire nuovi giochi. Con <strong>filtri</strong>,<strong> ordinamenti</strong>, <strong>preferiti</strong> e una pagina di
                  <strong> dettaglio</strong> ricca, puoi trovare subito cosa fa per te.
                </p>
              </div>
            </div>
          </div>

          {/* Come funziona */}
          <div className="col-12 col-lg-6">
            <div className="card h-100 bg-dark-subtle info-card shadow-sm">
              <div className="card-body">
                <h2 className="h5 d-flex align-items-center gap-2">
                  <span>🕹️</span> Come funziona
                </h2>
                <ol className="mb-0 ps-3">
                  <li>
                    Apri il <strong>Catalogo</strong> e cerca per titolo o categoria.
                  </li>
                  <li>
                    Apri la <strong>scheda</strong> del gioco per i dettagli (prezzo, piattaforme, lingue…).
                  </li>
                  <li>
                    Usa il <strong>cuore</strong> per aggiungere ai preferiti e ritrovarli ovunque nel sito.
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Feature */}
        <div className="row g-4 mb-4">
          {[
            { icon: "🔎", title: "Ricerca & Filtri", text: "Ricerca ottimizzata, filtro per categoria e ordinamento A→Z / Z→A." },
            { icon: "⭐", title: "Preferiti", text: "Aggiungi/rimuovi in qualunque pagina. Persistenza locale." },
            { icon: "🧭", title: "Navigazione intuitiva", text: "Link chiari e memorabili: trovi i giochi al volo e li condividi in un attimo." },
            { icon: "⚡", title: "Veloce come un power-up", text: "Risultati immediati e interfaccia fluidissima: cerchi, filtri e trovi in un lampo." },
          ].map((f, i) => (
            <div key={i} className="col-12 col-md-6 col-lg-3">
              <div className="card h-100 bg-dark-subtle info-card shadow-sm">
                <div className="card-body">
                  <div className="fs-3 mb-2">{f.icon}</div>
                  <h3 className="h6 mb-2">{f.title}</h3>
                  <p className="mb-0 text-opacity-75">{f.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="card bg-dark-subtle info-card shadow-sm mb-4">
          <div className="card-body">
            <h2 className="h5 d-flex align-items-center gap-2 mb-3">
              <span>❓</span> Domande frequenti
            </h2>

            <div className="accordion accordion-flush" id="faq">
              <div className="accordion-item bg-transparent border-secondary">
                <h2 className="accordion-header">
                  <button className="accordion-button collapsed bg-transparent" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                    Da dove arrivano i dati?
                  </button>
                </h2>
                <div id="faq1" className="accordion-collapse collapse" data-bs-parent="#faq">
                  <div className="accordion-body text-opacity-75">
                    I dati provengono da ricerche approfondite nel browser, puoi consultare la veridicità di essi anche su altri siti simili al nostro.
                  </div>
                </div>
              </div>

              <div className="accordion-item bg-transparent border-secondary">
                <h2 className="accordion-header">
                  <button className="accordion-button collapsed bg-transparent" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                    I preferiti rimangono salvati?
                  </button>
                </h2>
                <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#faq">
                  <div className="accordion-body text-opacity-75">Sì: vengono salvati e sono sempre accessibili nel cuoricino in basso a destra o nel link in alto a destra.</div>
                </div>
              </div>

              <div className="accordion-item bg-transparent border-secondary">
                <h2 className="accordion-header">
                  <button className="accordion-button collapsed bg-transparent" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                    Posso confrontare i giochi?
                  </button>
                </h2>
                <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#faq">
                  <div className="accordion-body text-opacity-75">Puoi selezionare due giochi e avviare il confronto dalla barra in basso nella pagina Catalogo.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-12 col-lg-6">
            <div className="card bg-dark-subtle info-card shadow-sm">
              <div className="card-body">
                <h2 className="h5 d-flex align-items-center gap-2">
                  <span>📫</span> Contatti
                </h2>
                <ul className="list-unstyled mb-0">
                  <li className="mb-1">
                    Email: <a href="mailto:info@gameHub.com">info@gameHub.com</a>
                  </li>
                  <li className="mb-1">Sede: Italia</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-6">
            <div className="card bg-dark-subtle info-card shadow-sm">
              <div className="card-body">
                <h2 className="h5 d-flex align-items-center gap-2">
                  <span>🧩</span> Tecnologie
                </h2>
                <p className="mb-2 text-opacity-75">React, React Router, Bootstrap 5, fetch API. Dati demo locali.</p>
                <p className="small text-opacity-50 mb-0">Marchi e titoli appartengono ai rispettivi proprietari. Le immagini sono segnaposto a scopo didattico.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-4">
          <Link to="/games" className="btn btn-primary btn-lg btn-cta">
            Vai al Catalogo
          </Link>
        </div>
      </div>
    </section>
  );
}
