import React from 'react';

const PROJECTS = [
  { name: "23964 Unbridled Loop", img: "/images/Wildwood Ave.jpg" },
  { name: "24253 Alydar Loop", img: "/images/Alydar Loop inside.jpg" },
  { name: "1011 Wildwood Ave", img: "/images/WildwoodAveraInside.jpg" },
  { name: "30293 Persimmon Dr", img: "/images/PersimmonDr.jpg" },
  { name: "6001 Ridgefield Pl", img: "/images/RidgeField PI Exteriors.jpg" },
  { name: "3000 Johnson Rd W", img: "/images/JOHNSONRDW.jpg" },
  { name: "1633 Phillips Lane", img: "/images/IsabelWay.jpg" },
  { name: "7823 Murray Heights", img: "/images/WildWoodAveraInside2.jpg" },
  { name: "8543 Three Dean Way", img: "/images/PherinWoodExteriors.jpg" },
  { name: "3821 Isabel Way W", img: "/images/IsabelWayWOutside (1).jpg" },
  { name: "31488 Buckingham Blvd", img: "/images/8095Vane Ct,Theodore.jpg" },
  { name: "6275 Bell Creek Ct E", img: "/images/PersimmonDrKitchen.jpg" },
  { name: "9010 Eastwood Dr", img: "/images/8095Vane,Inside.jpg" },
  { name: "205 Park Ave", img: "/images/8095VaneInside.jpg" },
  { name: "6567 Addison Woods", img: "/images/Wildwood Ave.jpg" },
];

const Portfolio = () => {
  return (
    <section className="sec sec-wh" id="portfolio">
      <div className="inner">
        <div className="reveal">
          <span className="tag">Portfolio</span>
          <h2 className="h2">Building Value Across<br/>The Region</h2>
        </div>

        <div className="proj-grid">
          {PROJECTS.map((proj, idx) => (
            <div className="proj-card reveal" key={idx}>
              <img src={proj.img} alt={proj.name} loading="lazy" />
              <div className="proj-overlay">
                <div className="proj-info">
                  <span className="proj-cat">Custom Residence</span>
                  <h3 className="proj-name">{proj.name}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
