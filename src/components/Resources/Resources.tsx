import React from 'react';
import CommonBanner from '../CommonSection/CommonBanner';
import styles from "./Resources.module.scss";

export default function EventsPage() {
  return (
    <>
      <CommonBanner 
        title = "Resources" imgSrc = "/images/commonBanner.png"
      />
    <section className={styles.facilitiesSection}>
      <div className="container">
        <h2 className={styles.sectionTitle}>Facilities for Developing Instructional Materials</h2>
        
        <div className={styles.facility}>
          <h3>Psychological Resource Centre</h3>
          <p>
            The institute has a well-equipped Psychological Resource Centre with a wide range of 
            psychological tests, apparatus, and CDs. Pupil-teachers are trained to administer these 
            tools, enabling them to apply psychological knowledge in assessing students’ IQ levels, 
            aspirations, interests, and attitudes. This hands-on training prepares them to become 
            effective and efficient educators.
          </p>
        </div>

        <div className={styles.facility}>
          <h3>Language Laboratory</h3>
          <p>
            A modern Language Lab has been established to support the institution’s vision and mission. 
            The lab is equipped with computers, headphones, DVDs, and recording devices to help students 
            improve spoken English and pronunciation. Additional resources are provided to enhance 
            communication skills and linguistic proficiency.
          </p>
        </div>

        <div className={styles.facility}>
          <h3>ICT Facilities (Educational Technology Lab)</h3>
          <p>
            The institution has an advanced ICT Resource Centre equipped with computers, servers, 
            internet connectivity, printers, laptops, projectors (OHP, LCD, Slide), televisions, 
            audio-visual aids, digital cameras, charts, models, and educational CDs/DVDs. These 
            facilities ensure the integration of technology into the teaching-learning process and 
            support teacher educators in improving their instructional skills.
          </p>
        </div>

        <div className={styles.facility}>
          <h3>Science (Physics & Mathematics) Resource Centre</h3>
          <p>
            The Science Resource Centre integrates both physical and life sciences, designed for 
            demonstrations by teachers as well as hands-on experiments by students. The lab 
            encourages inquiry-based learning, allowing students to test hypotheses, collect and 
            analyze data, and communicate scientific findings effectively.
          </p>
        </div>

        <div className={styles.facility}>
          <h3>Chemistry and Bio-Science Resource Centre</h3>
          <p>
            This resource centre supports experimental learning in chemistry and biological sciences. 
            It provides the necessary infrastructure and materials for demonstrations and student-led 
            experiments, fostering a scientific approach and curiosity-driven learning.
          </p>
        </div>

        <div className={styles.facility}>
          <h3>Health and Physical Resource Centre</h3>
          <p>
            To ensure the holistic development of future educators, the institution has a dedicated 
            Health and Physical Resource Centre. It provides facilities and equipment to promote 
            physical fitness, sportsmanship, and overall well-being.
          </p>
        </div>

        <div className={styles.facility}>
          <h3>Workshop for Teaching Aids</h3>
          <p>
            The college also has a well-organized workshop for preparing teaching aids. Students are 
            encouraged to design and develop creative instructional materials that can be effectively 
            used in classrooms, strengthening their practical teaching skills.
          </p>
        </div>
      </div>
    </section>
    </>
  );
}
