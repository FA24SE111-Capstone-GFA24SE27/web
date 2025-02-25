import React from 'react'
import PaginationMUI from '@mui/material/Pagination';
import clsx from 'clsx'
type Props = {
  count?: number,
  page: number,
  handleChange: (event: React.ChangeEvent<unknown>, value: number) => void
  className?: string,
  pageSize?: number
}

const Pagination = ({ count = 0, page = 1, handleChange, className = ``, pageSize = 10 }: Props) => {
  return (
    <div className={
      clsx(
        'flex justify-center items-center',
        className
      )
    }>
      {
        count > 1 ?
          <PaginationMUI
            count={count}
            shape="rounded"
            color='secondary'
            onChange={handleChange}
            page={page}
          />
          : null
      }
    </div>
  )
}

export default Pagination