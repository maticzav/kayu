import React from 'react'
import Layout from '@theme/Layout'
import Link from '@docusaurus/Link'
import useBaseUrl from '@docusaurus/useBaseUrl'

import styles from './styles.module.css'
import { Feature } from '../components/feature'

/* Page */

/**
 * Home page is a landing page that user gets to to
 */
export default function Home() {
  /* Constants */

  const thumbnailURL = useBaseUrl('./img/thumbnail.svg')

  /* Page */

  return (
    <Layout
      title={`KayuJS`}
      description="GraphQL client that lets you forget about GraphQL."
    >
      {/* Header */}
      <header>
        <div className="container">
          {/* Title */}
          <img
            className={styles.featureImage}
            src={thumbnailURL}
            alt={'KayuJS'}
          />
          <p className="hero__subtitle">
            GraphQL client that lets you forget about GraphQL
          </p>

          {/* Call to Action
          <div className={styles.buttons}>
            <Link
              // className={clsx(
              //   'button button--outline button--white button--lg',
              //   styles.getStarted,
              // )}
              to={useBaseUrl('docs/')}
            >
              Get Started
            </Link>
          </div> */}
        </div>
        {/*  */}
      </header>

      {/* Main */}
      <main>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Sandbox */}
      <iframe
        src="https://codesandbox.io/embed/starwars-01zdl?fontsize=14&hidenavigation=1&theme=dark&view=editor"
        style={{
          width: '100%',
          maxWidth: '700px',
          height: '400px',
          maxHeight: '50%',
          border: 0,
          borderRadius: '4px',
          overflow: 'hidden',
          margin: 'auto',
          display: 'block',
        }}
        title="StarWars"
        allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
        sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
      ></iframe>

      {/*  */}
    </Layout>
  )
}

/* Content */

const features = [
  {
    title: 'TypeSafe',
    imageUrl: 'img/undraw_docusaurus_mountain.svg',
    description: (
      <>
        Kayu was designed ground up to be end-to-end type-safe. If your project
        compiles, we guarantee that queries are valid.
      </>
    ),
  },
  {
    title: 'Focus on What Matters',
    imageUrl: 'img/undraw_docusaurus_tree.svg',
    description: (
      <>
        Docusaurus lets you focus on your docs, and we&apos;ll do the chores. Go
        ahead and move your docs into the <code>docs</code> directory.
      </>
    ),
  },
  {
    title: 'Lightweight',
    imageUrl: 'img/undraw_docusaurus_react.svg',
    description: <></>,
  },
]
