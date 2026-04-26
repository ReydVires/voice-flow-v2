import styles from './Pagination.module.css';

interface PaginationProps {
  totalItems: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
}

export const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  pageSize,
  currentPage,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
}) => {
  const totalPages = Math.ceil(totalItems / pageSize);
  if (totalPages <= 1 && totalItems <= pageSizeOptions[0]) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className={styles.pagination}>
      <div className={styles.info}>
        Showing <span>{startItem}</span> to <span>{endItem}</span> of <span>{totalItems}</span> jobs
      </div>

      <div className={styles.controls}>
        <div className={styles.pageSizeControl}>
          <select
            className={styles.pageSizeSelect}
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            {pageSizeOptions.map(option => (
              <option key={option} value={option}>{option} per page</option>
            ))}
          </select>
        </div>

        <div className={styles.pageButtons}>
          <button
            className={styles.pageButton}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => {
            const page = i + 1;
            // Simple logic for showing page numbers. For many pages, we'd add ellipsis.
            return (
              <button
                key={page}
                className={`${styles.pageButton} ${currentPage === page ? styles.pageButtonActive : ''}`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            );
          })}

          <button
            className={styles.pageButton}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
