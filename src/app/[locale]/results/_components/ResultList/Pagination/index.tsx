import { styles } from '@/app/[locale]/results/_components/ResultList/Pagination/styles';
import ArrowIcon from '@/app/_icons/ArrowIcon';

export const Pagination = ({
  totalPages,
  currentPage,
  handlePageChange,
}: {
  totalPages: number;
  currentPage: number;
  handlePageChange: (page: number) => void;
}) => {
  const renderPaginationButtons = () => {
    const paginationRange: (string | number)[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        paginationRange.push(i);
      }
    } else {
      if (currentPage === 1) {
        paginationRange.push(1, 2, 3, '...', totalPages);
      } else if (currentPage === totalPages) {
        paginationRange.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        paginationRange.push(1);

        if (currentPage > 2) {
          paginationRange.push('...');
        }

        paginationRange.push(currentPage);

        if (currentPage < totalPages - 1) {
          paginationRange.push('...');
        }

        paginationRange.push(totalPages);
      }
    }

    return paginationRange.map((page, index) => (
      <button
        className={`${styles.item} ${page === currentPage ? styles.selected : ''}`}
        key={index}
        onClick={() => typeof page === 'number' && handlePageChange(page)}
        disabled={page === '...'}
      >
        {page}
      </button>
    ));
  };

  return (
    <div className={styles.root}>
      {currentPage !== 1 && (
        <button
          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${styles.item} ${styles.arrowButton}`}
        >
          <ArrowIcon className={styles.arrowBack} />
        </button>
      )}

      {renderPaginationButtons()}
      {currentPage !== totalPages && (
        <button
          onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`${styles.item} ${styles.arrowButton}`}
        >
          <ArrowIcon />
        </button>
      )}
    </div>
  );
};
