import Link from 'next/link';

import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.center}>
        <div className={styles.thirteen}>
          <h1>Base Template Next, TypeScript, Prettier e Eslint</h1>
          <Link href="/Forms">Forms</Link>
        </div>
      </div>
    </main>
  );
}
