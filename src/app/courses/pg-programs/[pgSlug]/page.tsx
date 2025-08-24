// app/courses/pg-programs/[pgSlug]/page.tsx

import { pgProgram } from '@/app/apiData/pgProgram';
import CommonBanner from '@/components/CommonSection/CommonBanner';
import Footer from '@/components/shared/Footer/Footer';
import Header from '@/components/shared/Header/Header';
import { notFound } from 'next/navigation';
import styles from '../../courseDetail.module.scss';
import Image from 'next/image';

type Params = {
  params: {
    pgSlug: string;
  };
};

// Pre-render all PG course paths
export async function generateStaticParams() {
  return pgProgram.map((course) => ({
    pgSlug: course.pgSlug,
  }));
}

// Page component
export default function PgProgramDetail({ params }: Params) {
  const course = pgProgram.find((item: { pgSlug: string; }) => item.pgSlug === params.pgSlug);

  if (!course) return notFound();

  return (
    <>
      <Header />
      <CommonBanner title={course.title} />

      <section className={styles.articleContainer}>
        <div className='container'>
          <div className={styles.content}>
            <Image
              src={course.image}
              alt={course.title}
              width={300}
              height={200}
              className="rounded-xl object-cover"
            />
            {/* <h1 className={styles.title}>
                      {course.title}
                    </h1>

                    <div className={styles.paragraphs}>
                       <p><strong>Duration:</strong> {course.duration}</p> 
                        <p>
                            {course.description}
                        </p>
                    </div> */}

            <div className="w-full md:w-1/2">
              <h2 className="text-3xl font-bold text-blue-900 mb-3">{course.title}</h2>
              <p className="text-gray-700 font-medium mb-2">Duration: {course.duration}</p>
              <p className="text-gray-600 mb-4">{course.overview}</p>

              <h3 className="text-xl font-semibold text-blue-800 mt-4 mb-2">Program Highlights:</h3>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                {course.highlights.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>

              <h3 className="text-xl font-semibold text-blue-800 mt-4 mb-2">Key Features:</h3>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                {course.features.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>

              <h3 className="text-xl font-semibold text-blue-800 mt-4 mb-2">Program Outcome:</h3>
              <p className="text-gray-600">{course.outcome}</p>
            </div>
          </div>
        </div>
      </section>



      <Footer />
    </>
  );
}
