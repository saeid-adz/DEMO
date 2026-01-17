import './CommunitiesSection.css';

function CommunitiesSection({ data }) {
  return (
    <section className="communities-section">
      <h2 className="section-title">Communities & Certifications</h2>
      <div className="communities-grid">
        {data.map((community) => (
          <a
            key={community.id}
            href={community.link}
            target="_blank"
            rel="noopener noreferrer"
            className="community-card"
          >
            <div className="community-logo-wrapper">
              <img 
                src={community.logo} 
                alt={community.name}
                className="community-logo"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="community-logo-placeholder" style={{display: 'none'}}>
                {community.name.charAt(0)}
              </div>
            </div>
            <h3 className="community-name">{community.name}</h3>
            <p className="community-title">{community.title}</p>
            <p className="community-description">{community.description}</p>
          </a>
        ))}
      </div>
    </section>
  );
}

export default CommunitiesSection;
