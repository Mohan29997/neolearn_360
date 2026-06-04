import React, { Fragment } from 'react'
import TabTitle from '../../../components/tabtitle'
import { useAppSelector } from '../../../hooks/useAppSelector'
import type { RootState } from '../../../store'

const AdminDashboard = () => {
  const { _id } = useAppSelector((state: RootState) => state.adminProfile);

  return (
    <Fragment>
      <TabTitle title='Admin Dashboard' />
    </Fragment>
  )
}

export default AdminDashboard