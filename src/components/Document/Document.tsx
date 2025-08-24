import React from 'react'
import CommonBanner from '../CommonSection/CommonBanner'
import styles from "./Document.module.scss";

function Document() {
  return (
    <>
      <CommonBanner title="Documents" imgSrc="/images/commonBanner.png" />
      <div className="container">
        <div className={styles.documents_section}>
          <h2>List of All Documents</h2>
          <div className={styles.documents_list}>
            <div className={styles.doc_card}>
              <a href="/pdfs/Affidavit.pdf" target="_blank">Affidavit</a>
            </div>
            <div className={styles.doc_card}>
              <a href="/pdfs/Latest-recognition-order-nrc-nctc.pdf" target="_blank">Latest Recognition Order</a>
            </div>
            <div className={styles.doc_card}>
              <a href="/pdfs/University-affiliation-Order.pdf" target="_blank">University Affiliation Order</a>
            </div>
            <div className={styles.doc_card}>
              <a href="/pdfs/Land-document.pdf" target="_blank">Land Documents</a>
            </div>
            <div className={styles.doc_card}>
              <a href="/pdfs/Balance-Sheet-2022-23-J.pdf" target="_blank">Balance Sheet</a>
            </div>
            <div className={styles.doc_card}>
              <a href="/pdfs/Expenditures-2022-23-K.pdf" target="_blank">Income and Expenditures</a>
            </div>
            <div className={styles.doc_card}>
              <a href="/pdfs/" target="_blank">Biometric Data</a>
            </div>
          </div>
        </div>

        <div className={styles.documents_section}>
          <h2>Merit List</h2>
          <div className={styles.documents_list}>
            <div className={styles.doc_card}>
              <a href="/pdfs/merit-list-2021-22.pdf" target="_blank">2021-2022</a>
            </div>
            <div className={styles.doc_card}>
              <a href="/pdfs/merit-list-2022-23.pdf" target="_blank">2022-2023</a>
            </div>
          </div>
        </div>

         <div className={styles.documents_section}>
          <h2>Faculty</h2>
          <div className={styles.documents_list}>
            <div className={styles.doc_card}>
              <a href="/pdfs/STAFF-LIST_PAR.pdf" target="_blank">Faculty List</a>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}

export default Document