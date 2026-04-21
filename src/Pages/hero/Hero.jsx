import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../Services/api';
import { getCategoryImage } from '../../utils/courseUI';
import styles from './Hero.module.css';

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [ratings, setRatings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/courses?limit=3');
        const data = res.data.data?.courses || [];
        setCourses(data);

        const ratingRequests = data.map((c) =>
          api.get(`/courses/${c._id}/ratings`)
            .then(r => ({ id: c._id, data: r.data.data }))
            .catch(() => ({ id: c._id, data: null }))
        );
        const results = await Promise.all(ratingRequests);
        const map = {};
        results.forEach(r => map[r.id] = r.data);
        setRatings(map);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const categories = [
    { name: 'Programming',     icon: 'fa-solid fa-code' },
    { name: 'Business',        icon: 'fa-solid fa-briefcase' },
    { name: 'Design',          icon: 'fa-solid fa-pen-nib' },
    { name: 'Marketing',       icon: 'fa-solid fa-bullhorn' },
    { name: 'Web Development', icon: 'fa-solid fa-globe' },
  ];

  const whyUs = [
    { icon: 'fa-solid fa-chalkboard-user', title: 'Expert Instructors', desc: 'Learn from industry professionals' },
    { icon: 'fa-solid fa-mobile-screen',   title: 'Learn Anywhere',     desc: 'Study on your own schedule, anywhere' },
    { icon: 'fa-solid fa-certificate',     title: 'Certificates',       desc: 'Earn recognized certificates' },
    { icon: 'fa-solid fa-users',           title: 'Community',          desc: 'Connect with fellow learners' },
  ];

  return (
    <div>

      {/* ── HERO ── */}
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.heroContent}>

            <div className={styles.heroLeft}>
              <div className={styles.heroBadge}>
                <span className={styles.heroDot}></span>
                10,000+ students learning now
              </div>
              <h1 className={styles.title}>
                Learn skills that <span className={styles.highlight}>actually matter</span>
              </h1>
              <p className={styles.subtitle}>
                Expert-led courses in programming, design, business and more. Learn at your own pace and get certified.
              </p>
              <div className={styles.heroBtns}>
                <Link to="/courses" className={styles.btnPrimary}>Browse Courses</Link>
                <Link to="/register" className={styles.btnOutline}>
                  <span className={styles.playIcon}>
                    <i className="fa-solid fa-play"></i>
                  </span>
                  Start Now
                </Link>
              </div>
              <div className={styles.statsRow}>
                <div className={styles.statItem}>
                  <span className={styles.statNum}>10K+</span>
                  <span className={styles.statLbl}>Students</span>
                </div>
                <div className={styles.statDivider}></div>
                <div className={styles.statItem}>
                  <span className={styles.statNum}>200+</span>
                  <span className={styles.statLbl}>Courses</span>
                </div>
                <div className={styles.statDivider}></div>
                <div className={styles.statItem}>
                  <span className={styles.statNum}>50+</span>
                  <span className={styles.statLbl}>Instructors</span>
                </div>
              </div>
            </div>

            <div className={styles.heroRight}>
              <div className={styles.courseCard}>
                <div className={styles.cardTop}>
                  <div className={`${styles.cardIcon} ${styles.iconPurple}`}>
                    <i className="fa-solid fa-code"></i>
                  </div>
                  <div>
                    <div className={styles.cardName}>Web Development</div>
                    <div className={styles.cardCat}>Programming</div>
                  </div>
                </div>
                <div className={styles.cardProgressBar}>
                  <div className={`${styles.cardFill} ${styles.purpleFill}`} style={{ width: '72%' }}></div>
                </div>
                <div className={styles.cardMeta}>
                  <span>72% complete</span>
                  <span className={styles.stars}>
                    <i className="fa-solid fa-star"></i> 4.9
                  </span>
                </div>
              </div>

              <div className={styles.courseCard}>
                <div className={styles.cardTop}>
                  <div className={`${styles.cardIcon} ${styles.iconTeal}`}>
                    <i className="fa-solid fa-pen-nib"></i>
                  </div>
                  <div>
                    <div className={styles.cardName}>UI/UX Design</div>
                    <div className={styles.cardCat}>Design</div>
                  </div>
                </div>
                <div className={styles.cardProgressBar}>
                  <div className={`${styles.cardFill} ${styles.tealFill}`} style={{ width: '45%' }}></div>
                </div>
                <div className={styles.cardMeta}>
                  <span>45% complete</span>
                  <span className={styles.stars}>
                    <i className="fa-solid fa-star"></i> 4.8
                  </span>
                </div>
              </div>

              <div className={styles.floatingBadge}>
                <div className={styles.badgeAvatar}>s</div>
                <div className={styles.badgeText}>
                  <strong>sara just enrolled</strong>
                  Python for Beginners — 2 min ago
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className={styles.categoriesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Explore Popular Categories</h2>
            <p>Start learning with our most sought-after courses</p>
          </div>
          <div className={styles.categoriesGrid}>
            {categories.map((cat) => (
              <Link to={`/courses?category=${cat.name}`} key={cat.name} className={styles.categoryCard}>
                <i className={`${cat.icon} ${styles.categoryIcon}`}></i>
                <span className={styles.categoryName}>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED COURSES ── */}
      <section className={styles.coursesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeaderRow}>
            <div>
              <h2>Featured Courses</h2>
              <p>Top-rated courses from our expert instructors</p>
            </div>
            <Link to="/courses" className={styles.viewAllBtn}>View All →</Link>
          </div>

          {loading ? (
            <div className={styles.loader}>
              <i className="fa-solid fa-spinner fa-spin"></i> Loading...
            </div>
          ) : (
            <div className={styles.coursesGrid}>
              {courses.map((course) => {
                const r = ratings[course._id];
                const avg = r?.averageRating || r?.avgRating || 0;
                const count = r?.count || r?.totalRatings || 0;
                return (
                  <div key={course._id} className={styles.featuredCard}>
                    <div className={styles.featuredImageWrapper}>
                      <img src={getCategoryImage(course.category)} alt={course.title} className={styles.featuredImage} />
                    </div>
                    <div className={styles.featuredBody}>
                      <div className={styles.featuredTop}>
                        <span className={styles.tag}>{course.category}</span>
                        <div className={styles.rating}>
                          <i className={`fa-solid fa-star ${avg > 0 ? styles.star : styles.starOff}`}></i>
                          <span>{avg > 0 ? avg.toFixed(1) : 'No rating'}</span>
                          {count > 0 && <small>({count})</small>}
                        </div>
                      </div>
                      <h3 className={styles.featuredTitle}>{course.title}</h3>
                      <p className={styles.featuredDesc}>{course.description}</p>
                      <div className={styles.featuredFooter}>
                        <span className={styles.instructor}>
                          <i className="fa-solid fa-user"></i> Instructor
                        </span>
                        <Link to={`/course/${course._id}`} className={styles.viewBtn}>View Course</Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className={styles.whySection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.whyTitle}>Why Choose CourseHub?</h2>
            <p className={styles.whySubtitle}>Everything you need to level up your skills</p>
          </div>
          <div className={styles.whyGrid}>
            {whyUs.map((item) => (
              <div key={item.title} className={styles.whyCard}>
                <i className={`${item.icon} ${styles.whyIcon}`}></i>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerGrid}>
            <div className={styles.footerBrand}>
              <div className={styles.footerLogo}>
                <div className={styles.footerLogoBox}>
                  <i className="fa-solid fa-graduation-cap"></i>
                </div>
                <span>CourseHub</span>
              </div>
              <p>Empowering learners worldwide with quality online education. Start your learning journey today.</p>
            </div>
            <div className={styles.footerCol}>
              <h5>Platform</h5>
              <Link to="/courses">Browse Courses</Link>
              <Link to="/register">Become an Instructor</Link>
            </div>
            <div className={styles.footerCol}>
              <h5>Support</h5>
              <a href="#">Help Center</a>
              <a href="#">Contact Us</a>
              <a href="#">FAQs</a>
            </div>
            <div className={styles.footerCol}>
              <h5>Legal</h5>
              <a href="#">Terms of Service</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Cookie Policy</a>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <span>© 2026 CourseHub. All rights reserved.</span>
            <div className={styles.socialIcons}>
              <a href="#"><i className="fa-brands fa-twitter"></i></a>
              <a href="#"><i className="fa-brands fa-linkedin"></i></a>
              <a href="#"><i className="fa-brands fa-github"></i></a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}