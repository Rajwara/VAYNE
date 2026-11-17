import styles from './Bookshelf.module.css';

/**
 * Front cover of a book. Uses `book.cover` (an image URL) when present,
 * otherwise draws a typographic cover from `design` + `palette`.
 * Sized by its parent; text scales with the cover width (container units).
 */
export default function Cover({ book, className = '' }) {
  const [bg, ac, tx] = book.palette || ['#ddd', '#888', '#222'];
  const style = { '--bg': bg, '--ac': ac, '--tx': tx };

  if (book.cover) {
    return (
      <div className={`${styles.cover} ${className}`} style={style}>
        <img src={book.cover} alt="" className={styles.coverImg} draggable="false" />
        <span className={styles.spineShade} aria-hidden="true" />
      </div>
    );
  }

  const d = book.design;
  return (
    <div className={`${styles.cover} ${styles['d_' + d] || ''} ${className}`} style={style} aria-hidden="true">
      {d === 'sun' && <span className={styles.sun} />}
      {d === 'stripes' && <span className={styles.stripes} />}
      {d === 'dots' && <span className={styles.dots} />}
      {d === 'waves' && (
        <span className={styles.waves}>
          <i />
          <i />
          <i />
        </span>
      )}
      {d === 'peaks' && (
        <span className={styles.peaks}>
          <i />
          <i />
        </span>
      )}
      {d === 'frame' && <span className={styles.frame} />}
      {d === 'type' && <span className={styles.numeral}>{book.numeral || '01'}</span>}
      <span className={styles.coverText}>
        <span className={styles.coverAuthor}>{book.author}</span>
        <span className={styles.coverTitle}>{book.title}</span>
      </span>
      <span className={styles.spineShade} />
    </div>
  );
}
