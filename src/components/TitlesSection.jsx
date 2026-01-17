import './TitlesSection.css';

function TitlesSection({ data }) {
  return (
    <section className="titles-section">
      <h2 className="section-title">Professional Experience</h2>
      <div className="titles-grid">
        {data.map((title) => (
          <div key={title.id} className="title-card">
            <h3 className="title-role">{title.title}</h3>
            <p className="title-company">{title.company}</p>
            <p className="title-period">{title.period}</p>
            <p className="title-description">{title.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TitlesSection;
