import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../Services/api';
import styles from './ExploreCourses.module.css';

import { getCategoryImage } from '../../utils/courseUI';

export default function ExploreCourses() {
  const [courses, setCourses] = useState([]);
  const [ratings, setRatings] = useState({});
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);

        let query = `/courses?search=${search}`;
        if (category !== 'All') query += `&category=${category}`;

        const res = await api.get(query);
        const data = res.data.data?.courses || [];

        setCourses(data);

        const ratingRequests = data.map((c) =>
          api.get(`/courses/${c._id}/ratings`)
            .then(r => ({
              id: c._id,
              data: r.data.data
            }))
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
  }, [search, category]);

  const chips = ['All', 'Programming', 'Business', 'Design', 'Marketing','Web Development'
];

  return (
    <div className={styles.page}>

      {/* HERO */}
      <div className={styles.hero}>
        <div className="container">
          <h1>Find your next skill 
            <i className="fa-solid fa-rocket"></i>
          </h1>
          <p>Explore courses and start learning instantly</p>

          <div className={styles.searchBox}>
            <i className="fa-solid fa-magnifying-glass"></i>

            <input
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className={styles.chips}>
            {chips.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={category === c ? styles.activeChip : ''}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="container">

        <div className={styles.header}>
          <h2>Courses</h2>
          <span>{courses.length} results</span>
        </div>

        {loading ? (
          <div className={styles.loader}>Loading...</div>
        ) : (
          <div className={styles.grid}>

            {courses.map((course) => {
              const r = ratings[course._id];
  console.log("RAW CATEGORY:", course.category);
  console.log("CLEAN CATEGORY:", course.category?.trim().toLowerCase());


              const avg = r?.averageRating || r?.avgRating || 0;
              const count = r?.count || r?.totalRatings || 0;

              return (
                <div key={course._id} className={styles.card}>

                  {/* 🖼️ IMAGE ADDED */}
                  <div className={styles.imageWrapper}>
                    <img
                      src={getCategoryImage(course.category)}
                      alt={course.title}
                      className={styles.image}
                      
                    />
                  </div>

                  {/* TOP */}
                  <div className={styles.top}>
                    <span className={styles.tag}>
                      {course.category}
                    </span>

                    <div className={styles.rating}>
                      <i className={`fa-solid fa-star ${avg > 0 ? styles.star : styles.starOff}`}></i>

                      <span>
                        {avg > 0 ? avg.toFixed(1) : 'No rating'}
                      </span>

                      {count > 0 && (
                        <small>({count})</small>
                      )}
                    </div>
                  </div>

                  {/* TITLE */}
                  <h3 className={styles.title}>
                    {course.title}
                  </h3>

                  {/* DESC */}
                  <p className={styles.desc}>
                    {course.description}
                  </p>

                  {/* FOOTER */}
                  <div className={styles.footer}>
                    <span className={styles.instructor}>
                      <i className="fa-solid fa-user"></i> Instructor
                    </span>

                    <Link to={`/course/${course._id}`}>
                      View Course
                    </Link>
                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>
    </div>
  );
}