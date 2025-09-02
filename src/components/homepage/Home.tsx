"use client";
import React, { useEffect, useRef, useState } from 'react'
import Header from '../shared/Header/Header'
import Footer from '../shared/Footer/Footer'
import styles from './Home.module.scss'
import Image from "next/image";
import { motion } from 'framer-motion';
import { useSlider } from '@/contexts/SliderContext';
import { useOurSuccess } from '@/contexts/OurSuccessContext';
import { useOurInstitutions } from '@/contexts/OurInstitutionsContext';
import { useOurRecruiters } from '@/contexts/OurRecruitersContext';
import { useWhyChooseUs } from '@/contexts/WhyChooseUsContext';
import { useTestimonial } from '@/contexts/TestimonialContext';
import { useOutstandingPlacements } from '@/contexts/OutstandingPlacementsContext';

function fadeIn(delay = 0) {
  return {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.7, delay }
  };
}

function Home() {
  const { getActiveSliders } = useSlider();
  const { data: ourSuccessData } = useOurSuccess();
  const { data: ourInstitutionsData, getActiveInstitutions } = useOurInstitutions();
  const { data: ourRecruitersData, getFeaturedRecruiters, getActiveRecruiters } = useOurRecruiters();
  const { data: whyChooseUsData, getActiveReasons } = useWhyChooseUs();
  const { data: testimonialData, getActiveTestimonials } = useTestimonial();
  const { data: placementsData, getActivePlacements } = useOutstandingPlacements();
  
  // Institutions interactive state
  const [activeInstitution, setActiveInstitution] = useState(1);

  // Testimonial slider data and logic - now using context data
  const testimonials = getActiveTestimonials().map(testimonial => ({
    img: testimonial.image,
    text: testimonial.text,
    author: testimonial.name,
    stars: testimonial.stars
  }));
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const handleNextTestimonial = () => {
    if (testimonials.length > 0) {
      setTestimonialIdx((prev) => (prev + 1) % testimonials.length);
    }
  };

  // Hero slider data and logic - now using context data
  const activeSliders = getActiveSliders();
  const heroSlides = activeSliders.length > 0 ? activeSliders : [
    {
      id: 'default',
      title: 'TRANSLAM Group of Institutions',
      subtitle: 'Shaping Futures with Excellence in Education Since 1987',
      image: '/images/teenage-girl.png',
      order: 0,
      isActive: true
    }
  ];
  const [heroIdx, setHeroIdx] = useState(0);

  // Autoplay for hero slider
  useEffect(() => {
    const timer = setTimeout(() => {
      setHeroIdx((prev) => (prev + 1) % heroSlides.length);
    }, 4000); // 4 seconds
    return () => clearTimeout(timer);
  }, [heroIdx, heroSlides.length]);

  const handlePrevHero = () => {
    setHeroIdx((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };
  const handleNextHero = () => {
    setHeroIdx((prev) => (prev + 1) % heroSlides.length);
  };


  const reasons = getActiveReasons();


  const students = [
  {
    "name": "Anny",
    "company": "HCL",
    "image": "/images/testimonial-slide1.png"
  },
  {
    "name": "John",
    "company": "HCL",
    "image": "/images/testimonial-slide1.png"
  },
  {
    "name": "Anny",
    "company": "HCL",
    "image": "/images/testimonial-slide1.png"
  },
  {
    "name": "Anny",
    "company": "HCL",
    "image": "/images/testimonial-slide1.png"
  },
  {
    "name": "Anny",
    "company": "HCL",
    "image": "/images/testimonial-slide1.png"
  },
  {
    "name": "Anny",
    "company": "HCL",
    "image": "/images/testimonial-slide1.png"
  }
]
  return (
    <>
      <Header />
      <main>
        {/* Hero Section with Slider */}
        <motion.section className={styles.heroSection}
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <button className={styles.heroPrevBtn} onClick={handlePrevHero}>
            <span>&#8592;</span>
          </button>
          <div className={styles.heroBg}>
          
            <motion.div className={styles.heroRight}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <motion.img
                src={heroSlides[heroIdx].image}
                alt="Hero"
                className={styles.heroImg}
                key={heroSlides[heroIdx].image}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
              />
              {/* <div className={styles.heroStat} style={{ top: '60px', left: '40px' }}>
                <img src={heroSlides[heroIdx].stats[0].icon} alt="Calendar" />
                <div>
                  <div className={styles.heroStatLabel}>{heroSlides[heroIdx].stats[0].label}</div>
                  <div className={styles.heroStatDesc}>{heroSlides[heroIdx].stats[0].desc}</div>
                </div>
              </div> */}
              {/* <div className={styles.heroStat} style={{ top: '120px', right: '10px' }}>
                <img src={heroSlides[heroIdx].stats[1].icon} alt="Check" />
                <div>
                  <div className={styles.heroStatLabel}>{heroSlides[heroIdx].stats[1].label}</div>
                  <div className={styles.heroStatDesc}>{heroSlides[heroIdx].stats[1].desc}</div>
                </div>
              </div>
              <div className={styles.heroStat} style={{ bottom: '40px', left: '60px' }}>
                <img src={heroSlides[heroIdx].stats[2].icon} alt="User" className={styles.heroUserImg} />
                <div>
                  <div className={styles.heroStatLabel}>{heroSlides[heroIdx].stats[2].label}</div>
                  <div className={styles.heroStatDesc}>{heroSlides[heroIdx].stats[2].desc}</div>
                  <button className={styles.heroJoinBtn}>{heroSlides[heroIdx].stats[2].btn}</button>
                </div>
              </div> */}

            </motion.div>

          </div>
          <button className={styles.heroNextBtn} onClick={handleNextHero}>
            <span>&#8594;</span>
          </button>
        </motion.section>

        {/* Success Section */}
        <motion.section className={styles.successSection} {...fadeIn(0.1)}>
          <div className='container'>
            <h2 className={styles.sectionTitle}>{ourSuccessData.title.split(' ').map((word, index) => 
              index === 1 ? <span key={index}>{word}</span> : word + ' '
            )}</h2>
            <div 
              className={styles.successDesc}
              dangerouslySetInnerHTML={{ __html: ourSuccessData.description }}
            />
            <div className={styles.statsRow}>
              <div className={styles.statBox}>
                <div className={styles.statValue}>{ourSuccessData.stats.graduates}</div>
                <div className={styles.statLabel}>{ourSuccessData.stats.graduatesLabel}</div>
              </div>
              <div className={styles.statBox}>
                <div className={styles.statValue}>{ourSuccessData.stats.alumni}</div>
                <div className={styles.statLabel}>{ourSuccessData.stats.alumniLabel}</div>
              </div>
              <div className={styles.statBox}>
                <div className={styles.statValue}>{ourSuccessData.stats.yearsExcellence}</div>
                <div className={styles.statLabel}>{ourSuccessData.stats.yearsExcellenceLabel}</div>
              </div>
              <div className={styles.statBox}>
                <div className={styles.statValue}>{ourSuccessData.stats.recruiters}</div>
                <div className={styles.statLabel}>{ourSuccessData.stats.recruitersLabel}</div>
              </div>
              <div className={styles.statBox}>
                <div className={styles.statValue}>{ourSuccessData.stats.placementRate}</div>
                <div className={styles.statLabel}>{ourSuccessData.stats.placementRateLabel}</div>
              </div>
            </div>
          </div>
        </motion.section>

     

        {/* Recruiters Section */}
        <motion.section className={styles.recruitersSection} {...fadeIn(0.3)}>
          <div className='container'>
            <div className={styles.recruitersHeader}>
              <motion.div
                className={styles.recruitersHeaderContent}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <h2 className={styles.sectionTitle}>{ourRecruitersData.title.split(' ').map((word, index) => 
                  index === 1 ? <span key={index}>{word}</span> : word + ' '
                )}</h2>
                <div 
                  className={styles.recruitersDesc}
                  dangerouslySetInnerHTML={{ __html: ourRecruitersData.description }}
                />
                <div className={styles.recruitersOverview}>
                  <div className={styles.recruitersStatCard}>
                    <span className={styles.recruitersStatNumber}>{ourRecruitersData.stats.partnerCompanies}</span>
                    <span className={styles.recruitersStatLabel}>{ourRecruitersData.stats.partnerCompaniesLabel}</span>
                  </div>
                  <div className={styles.recruitersStatCard}>
                    <span className={styles.recruitersStatNumber}>{ourRecruitersData.stats.placementRate}</span>
                    <span className={styles.recruitersStatLabel}>{ourRecruitersData.stats.placementRateLabel}</span>
                  </div>
                  <div className={styles.recruitersStatCard}>
                    <span className={styles.recruitersStatNumber}>{ourRecruitersData.stats.averagePackage}</span>
                    <span className={styles.recruitersStatLabel}>{ourRecruitersData.stats.averagePackageLabel}</span>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className={styles.recruitersShowcase}>
              <motion.div
                className={styles.featuredRecruiters}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <h3 className={styles.featuredTitle}>{ourRecruitersData.featuredTitle}</h3>
                <div className={styles.featuredLogos}>
                  {getFeaturedRecruiters().map((recruiter, index) => (
                    <motion.div
                      key={index}
                      className={styles.featuredRecruiterCard}
                      whileHover={{ y: -5, scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={styles.featuredLogoWrap}>
                        <Image
                          src={recruiter.logo}
                          alt={recruiter.name}
                          width={120}
                          height={120}
                          className={styles.featuredLogo}
                        />
                      </div>
                      <span className={styles.recruiterCategory}>{recruiter.category}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className={styles.recruitersGrid}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <h3 className={styles.gridTitle}>{ourRecruitersData.allPartnersTitle}</h3>
                <div className={styles.recruitersLogosGrid}>
                  {getActiveRecruiters().filter(r => !r.isFeatured).map((recruiter, index) => (
                    <motion.div
                      key={index}
                      className={styles.gridRecruiterCard}
                      whileHover={{
                        scale: 1.05,
                        rotate: [0, -1, 1, 0],
                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                      }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Image
                        src={recruiter.logo}
                        alt={recruiter.name}
                        width={80}
                        height={80}
                        className={styles.gridRecruiterLogo}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            <motion.div
              className={styles.recruitersCallToAction}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h3>{ourRecruitersData.callToAction.title}</h3>
              <div dangerouslySetInnerHTML={{ __html: ourRecruitersData.callToAction.description }} />
              <motion.button
                className={styles.placementBtn}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {ourRecruitersData.callToAction.buttonText}
              </motion.button>
            </motion.div>
          </div>
        </motion.section>

        {/* Why Choose Us Section */}
        <motion.section className={styles.whyChooseSection} {...fadeIn(0.4)}>
          <div className='container'>
            <h2 className={styles.sectionTitle}>{whyChooseUsData.title.split(' ').map((word, index) => {
              if (word === 'Choose') return <span key={index}>{word}</span>;
              if (word === 'US') return <span key={index}>{word} </span>;
              if (word === '?') return <span key={index}>{word}</span>;
              return word + ' ';
            })}</h2>
            <div className={styles.whyChooseContent}>
              {whyChooseUsData.description && (
                <div className={styles.whyChooseText}>
                  <div 
                    style={{ textAlign: 'center', marginBottom: '40px', fontSize: '18px', color: '#6b7280' }}
                    dangerouslySetInnerHTML={{ __html: whyChooseUsData.description }}
                  />
                </div>
              )}
              <div className={styles.cardGrid}>
                {reasons.map((reason, index) => (
                  <motion.div
                    className={styles.card}
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className={styles.card} key={index}>
                      <h3>{reason.title}</h3>
                      <span className={styles.subtitle}>{reason.subtitle}</span>
                      <p>{reason.description}</p>
                      <div className={styles.tags}>
                        {reason.tags.map((tag, idx) => (
                          <span className={styles.tag} key={idx}>
                            {tag}
                          </span>
                        ))}
                      </div>

                    </div>
                  </motion.div>
                ))}
              </div>
              {/* <div className={styles.whyChooseMedia}>
                <div className={styles.mediaWrap}>
                  <img src="/images/college-student.jpeg" alt="Classroom" className={styles.classroomImg} />
                  <span className={styles.playBtn}>

                  </span>
                </div>
              </div> */}
            </div>
          </div>
        </motion.section>

        {/* Placements Section */}
        <motion.section className={styles.placementsSection} {...fadeIn(0.5)}>
          <div className='container'>
            <h2 className={styles.placementsTitle}>{placementsData?.title?.split(' ').map((word, index) => {
              if (word === 'Outstanding') return <span key={index}>{word}</span>;
              if (word === 'Placements') return <span key={index}> {word}</span>;
              return word + ' ';
            }) || 'Outstanding Placements'}</h2>
            <div className={styles.placementsDesc} dangerouslySetInnerHTML={{ __html: placementsData?.description || '' }}></div>
            <div className={styles.placementsGrid}>
              {getActivePlacements && getActivePlacements().map((placement) => (
                <div className={styles.placementCard} key={placement.id}>
                  <Image
                    src={placement.image}
                    alt={placement.name}
                    width={300}
                    height={300}
                    priority
                    className={styles.placementImg}
                  />
                  <div className={styles.placementName}>{placement.name}</div>
                  <div className={styles.placementCompany}>{placement.company}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Tools For Teachers Section */}
        <motion.section {...fadeIn(0.6)}>
          <div className='container'>
            <div className={styles.toolsSection}>
              <div className={styles.toolsContent}>
                <div className={styles.toolsText}>
                  <h3><span className={styles.toolsHighlight}>Empowering</span> Teachers & Students</h3>
                  <p>Our digital learning ecosystem equips educators with innovative tools to enhance teaching and makes learning engaging for students. Teachers can create, share, and assess assignments instantly, while students enjoy real-time feedback and interactive resources.</p>
                </div>
                <div className={styles.toolsImageWrap}>
                  <Image
                    src="/images/girl-img.png"
                    alt="Next.js logo"
                    width={450}
                    height={500}
                    priority
                    className={styles.toolsImg}
                  />
                  {/* Decorative icons can be added here if needed */}
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Explore Course Section */}
        <motion.section className={styles.exploreCourseSection} {...fadeIn(0.7)}>
          <div className='container'>
            <div className={styles.exploreCourseBg}>
              <h2 className={styles.exploreCourseTitle}>Explore <span>Course</span></h2>

              {/* Course List */}
              {[{
                title: 'BCA',
                desc: 'The BCA program at Translam is a three-year undergraduate degree focused on computer applications, software development, and IT skills, preparing students for the fast-growing technology sector.',
                img: '/images/bca.jpg',
                viewCurseLink: '/courses/graduate-program/bca'
              }, {
                title: 'BBA',
                desc: 'The BBA program at Translam is a comprehensive three-year undergraduate degree designed to develop foundational knowledge in business and management, along with leadership and entrepreneurial skills.',
                img: '/images/bba.jpeg',
                viewCurseLink: '/courses/graduate-program/bba'
              }, {
                title: 'B.ED.',
                desc: 'The B.Ed. program at Translam College of Education is a two-year undergraduate professional course designed to prepare future educators with modern teaching methodologies, classroom management skills, and a deep understanding of child psychology',
                img: '/images/bed.png',
                viewCurseLink: '/courses/graduate-program/b-ed'
              },
              {
                title: 'B.Sc. Biotechnology',
                desc: 'The B.Sc. Biotechnology program at Translam is a three-year undergraduate degree that integrates biology with technology to explore innovative solutions in healthcare, agriculture, and environmental sciences.',
                img: '/images/bsc-biotech.webp',
                viewCurseLink: '/courses/graduate-program/b-sc-biotechnology'
              }].map((course, idx) => (
                <div className={styles.courseRow} key={idx}>
                  <div className={styles.courseIconWrap}>
                    {/* <div>
                      <span className={styles.courseIconText}>Lorem Ipsum</span>
                    </div> */}
                    <a href={course.viewCurseLink} className={styles.viewCourseLink}>
                      VIEW COURSE <span className={styles.arrow}>&rarr;</span>
                    </a>
                  </div>
                  <div className={styles.courseCard}>
                    <div className={styles.courseInfo}>
                      <h3>{course.title}</h3>
                      <p>{course.desc}</p>
                    </div>
                    <div className={styles.courseImgWrap}>
                      <img src={course.img} alt={course.title} className={styles.courseImg} />
                    </div>

                  </div>
                </div>
              ))}

             
            </div>
          </div>
        </motion.section>

        {/* Events Section */}
 

        {/* Testimonial Section */}
        <motion.section className={styles.testimonialSection}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className='container'>
            <motion.div className={styles.testimonialContent}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className={styles.testimonialLeft}>
                <div className={styles.testimonialLabel}>{testimonialData.label}</div>
                <h2 className={styles.testimonialTitle}>{testimonialData.title.split(' ').map((word, index) => {
                  if (word === 'Student') return <span key={index}>{word}</span>;
                  if (word === 'Say') return word + ' ';
                  if (word === 'Say?') return word.replace('Say?', 'Say') + ' ';
                  if (word === '?') return <span key={index} className={styles.testimonialQ}>{word}</span>;
                  return word + ' ';
                })}</h2>
                {testimonialData.descriptions.map((desc, index) => (
                  <p key={index} className={styles.testimonialDesc}>{desc}</p>
                ))}
                {/* <button className={styles.testimonialBtn}>
                  Write your assessment <span className={styles.testimonialBtnArrow}>&rarr;</span>
                </button> */}
              </div>
              <motion.div className={styles.testimonialRight}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                {testimonials.length > 0 ? (
                  <div className={styles.testimonialSlider}>
                    <div className={styles.testimonialImageWrap}>
                      <img src={testimonials[testimonialIdx].img} alt="Student" className={styles.testimonialImg} />
                      <button className={styles.testimonialNextBtn} onClick={handleNextTestimonial}>
                        <span>&#8250;</span>
                      </button>
                    </div>
                    <motion.div className={styles.testimonialCard}
                      key={testimonialIdx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <p className={styles.testimonialText}>
                        {testimonials[testimonialIdx].text}
                      </p>
                      <div className={styles.testimonialAuthorWrap}>
                        <span className={styles.testimonialAuthor}>{testimonials[testimonialIdx].author}</span>
                        <span className={styles.testimonialStars}>
                          {Array(testimonials[testimonialIdx].stars).fill(0).map((_, i) => (
                            <span key={i} className={styles.star}>★</span>
                          ))}
                        </span>
                      </div>
                    </motion.div>
                  </div>
                ) : (
                  <div className={styles.testimonialSlider}>
                    <div className={styles.testimonialImageWrap}>
                      <div style={{ 
                        width: '100%', 
                        height: '200px', 
                        background: '#f3f4f6', 
                        borderRadius: '8px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: '#9ca3af',
                        fontSize: '14px'
                      }}>
                        No testimonials available
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

      </main>
      <Footer />
    </>
  )
}

export default Home