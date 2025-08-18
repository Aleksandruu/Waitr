'use client';

import Link from 'next/link';
import { classNames } from '../../helpers/className';
import Button from '../../base_components/Button/Button';
import styles from './LandingPage.module.scss';

export default function LandingPage() {
  const handleGetStarted = () => {
    window.location.href = '/login';
  };

  const handleLearnMore = () => {
    // Scroll to features section
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={styles.landingPage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <h1 className={styles.heroTitle}>
            Transform Your HoReCa Business with Waitr
          </h1>
          <p className={styles.heroSubtitle}>
            Automate on-premise ordering, understand your customers better, and streamline operations 
            with our intelligent SaaS platform designed specifically for Hotels, Restaurants, and Catering businesses.
          </p>
          <div className={styles.heroButtons}>
            <Button
              text="Get Started Now"
              color="yellow"
              wide={true}
              tall={true}
              onClick={handleGetStarted}
            />
            <Button
              text="Learn More"
              color="brand-light"
              wide={true}
              tall={true}
              onClick={handleLearnMore}
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.stats}>
        <div className={styles.container}>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>500+</div>
              <div className={styles.statLabel}>Restaurants Trust Us</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>95%</div>
              <div className={styles.statLabel}>Customer Satisfaction</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>40%</div>
              <div className={styles.statLabel}>Average Time Savings</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>24/7</div>
              <div className={styles.statLabel}>Expert Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={styles.features}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            Everything You Need to Succeed
          </h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🍽️</div>
              <h3 className={styles.featureTitle}>Smart Order Management</h3>
              <p className={styles.featureDescription}>
                Streamline table orders with intelligent automation. Real-time order tracking, 
                kitchen integration, and seamless customer experience.
              </p>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>👥</div>
              <h3 className={styles.featureTitle}>Customer Intelligence</h3>
              <p className={styles.featureDescription}>
                Understand your customers like never before. Analyze preferences, 
                track behavior, and personalize experiences to boost loyalty.
              </p>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📊</div>
              <h3 className={styles.featureTitle}>Analytics & Insights</h3>
              <p className={styles.featureDescription}>
                Make data-driven decisions with comprehensive analytics. Track performance, 
                identify trends, and optimize your operations.
              </p>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>⚡</div>
              <h3 className={styles.featureTitle}>Process Automation</h3>
              <p className={styles.featureDescription}>
                Automate repetitive tasks and reduce manual errors. From inventory management 
                to staff scheduling, we've got you covered.
              </p>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📱</div>
              <h3 className={styles.featureTitle}>Multi-Platform Access</h3>
              <p className={styles.featureDescription}>
                Access your business data anywhere, anytime. Mobile-friendly interface 
                ensures you're always connected to your operations.
              </p>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🔧</div>
              <h3 className={styles.featureTitle}>Easy Integration</h3>
              <p className={styles.featureDescription}>
                Seamlessly integrate with your existing systems. POS, inventory, 
                accounting software - we work with what you already use.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className={styles.benefits}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            Why Choose Waitr?
          </h2>
          <div className={styles.benefitsGrid}>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>✅</div>
              <div className={styles.benefitText}>Reduce wait times by up to 50%</div>
            </div>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>✅</div>
              <div className={styles.benefitText}>Increase table turnover rate</div>
            </div>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>✅</div>
              <div className={styles.benefitText}>Eliminate order mistakes</div>
            </div>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>✅</div>
              <div className={styles.benefitText}>Boost customer satisfaction</div>
            </div>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>✅</div>
              <div className={styles.benefitText}>Reduce operational costs</div>
            </div>
            <div className={styles.benefitItem}>
              <div className={styles.benefitIcon}>✅</div>
              <div className={styles.benefitText}>Scale your business efficiently</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>
            Ready to Transform Your Business?
          </h2>
          <p className={styles.ctaDescription}>
            Join hundreds of successful HoReCa businesses that have already revolutionized 
            their operations with Waitr. Start your free trial today!
          </p>
          <Button
            text="Start Free Trial"
            color="yellow"
            wider={true}
            tall={true}
            onClick={handleGetStarted}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <p className={styles.footerText}>
            © 2024 Waitr. All rights reserved. Empowering HoReCa businesses worldwide.
          </p>
        </div>
      </footer>
    </div>
  );
}