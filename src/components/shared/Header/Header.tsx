"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Header.module.scss';
import { pgProgram } from '@/app/apiData/pgProgram';
import { ugProgram } from '@/app/apiData/ugProgram';
import { diplomaProgram } from '@/app/apiData/diplomaProgram';
import Marquee from 'react-fast-marquee';
import ShortNewsTicker from '../../ShortNewsTicker';

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openSubmenu, setOpenSubmenu] = useState(null); // for multi-level
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDropdown = (dropdownName) => {
    setOpenDropdown((prev) => (prev === dropdownName ? null : dropdownName));
    setOpenSubmenu(null); // reset submenus on change
  };

  const toggleSubmenu = (submenuName) => {
    setOpenSubmenu((prev) => (prev === submenuName ? null : submenuName));
  };

  // Close dropdowns when clicking mobile menu links
  const handleMobileLinkClick = () => {
    setOpenDropdown(null);
    setOpenSubmenu(null);
  };

  return (
    <header className={scrolled ? styles.scrollHeader : styles.stickyHeader}>

      <div className={styles.marqueeContainer}>
        <ShortNewsTicker />
      </div>
      <div className={styles.containerFluid}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <Link href="/">
              <img src="/images/tce-logo.png" alt="Logo" />
            </Link>
          </div>

          <button
            className={styles.hamburger}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={menuOpen ? styles.barOpen : styles.bar}></span>
            <span className={menuOpen ? styles.barOpen : styles.bar}></span>
            <span className={menuOpen ? styles.barOpen : styles.bar}></span>
          </button>

          <nav className={menuOpen ? styles.navMobile : styles.nav}>
            <ul>
              <li className={pathname === '/' ? styles.active : ''}><Link href="/">Home</Link></li>
              <li className={styles.dropdown + ' ' + (pathname.startsWith('/about') || pathname.startsWith('/philosophy') ? styles.active : '')}>
                <span
                  className={styles.dropdownToggle}
                  onClick={() => toggleDropdown("aboutUs")}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && toggleDropdown("aboutUs")}
                >About Us ▾
                </span>
                <ul className={`${styles.dropdownMenu} ${openDropdown === "aboutUs" ? styles.show : ""}`}>
                      <li><Link href="/about">About Group</Link></li>
                      <li><Link href="/philosophy">Our Philosophy</Link></li>
                </ul>
              </li>
             
              <li className={pathname.startsWith('/admission') ? styles.active : ''}><Link href="/admission">Admission</Link></li>

              {/* Courses Dropdown (Multi-Level) */}
              <li className={styles.dropdown + ' ' + (pathname.startsWith('/courses') ? styles.active : '')}>
                <span
                  className={styles.dropdownToggle}
                  onClick={() => toggleDropdown("courses")}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && toggleDropdown("courses")}
                >
                   Courses ▾
                </span>
                <ul className={`${styles.dropdownMenu} ${openDropdown === "courses" ? styles.show : ""}`}>
    
                       {ugProgram.map((course) => (
                          <li key={course.ugSlug}>
                            <Link href={`/courses/graduate-program/${course.ugSlug}`}>
                              {course.title}
                            </Link>
                          </li>
                        ))}
                
                </ul>
              </li>
              <li className={pathname.startsWith('/placement') ? styles.active : ''}><Link href="/placement">Placements</Link></li>
              <li className={pathname.startsWith('/resources') ? styles.active : ''}><Link href="/resources">Resources</Link></li>
              <li className={pathname.startsWith('/documents') ? styles.active : ''}><Link href="/documents">Documents</Link></li>
              <li className={pathname.startsWith('/events') ? styles.active : ''}><Link href="/events">Events</Link></li>
              <li className={pathname.startsWith('/contact') ? styles.active : ''}><Link href="/contact">Contact Us</Link></li>
            </ul>

              <div className={styles.loginBtnContainer}>          
              <button className={styles.loginBtn}>Login</button>
              </div>

          </nav>

          <button className={styles.loginBtn}>Login</button>
        </div>
      </div>
    </header>
  );
}

export default Header;
