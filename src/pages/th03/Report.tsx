import { useEffect, useState } from 'react'
import { Table } from 'antd'

export default function Report(){

  const [appointments,setAppointments] = useState<any[]>([])
  const [services,setServices] = useState<any[]>([])

  useEffect(()=>{

    const a = JSON.parse(localStorage.getItem('appointments') || '[]')
    const s = JSON.parse(localStorage.getItem('services') || '[]')

    setAppointments(a)
    setServices(s)

  },[])

  const getByDate = ()=>{

    const map:any = {}

    appointments.forEach(item=>{

      if(!map[item.date]){
        map[item.date] = 0
      }

      map[item.date]++

    })

    return Object.keys(map).map(date=>({
      date,
      total:map[date]
    }))

  }

  const getByMonth = ()=>{

    const map:any = {}

    appointments.forEach(item=>{

      const month = item.date.substring(0,7)

      if(!map[month]){
        map[month] = 0
      }

      map[month]++

    })

    return Object.keys(map).map(month=>({
      month,
      total:map[month]
    }))

  }

  const revenueByService = ()=>{

    const map:any = {}

    appointments
      .filter(a=>a.status === 'Hoàn thành')
      .forEach(item=>{

        const service = services.find(
          s=>s.name === item.service
        )

        if(!service) return

        if(!map[item.service]){
          map[item.service] = 0
        }

        map[item.service] += service.price

      })

    return Object.keys(map).map(name=>({
      service:name,
      revenue:map[name]
    }))

  }

  const revenueByStaff = ()=>{

    const map:any = {}

    appointments
      .filter(a=>a.status === 'Hoàn thành')
      .forEach(item=>{

        const service = services.find(
          s=>s.name === item.service
        )

        if(!service) return

        if(!map[item.staff]){
          map[item.staff] = 0
        }

        map[item.staff] += service.price

      })

    return Object.keys(map).map(name=>({
      staff:name,
      revenue:map[name]
    }))

  }

  const dateColumns = [
    {
      title:'Ngày',
      dataIndex:'date'
    },
    {
      title:'Số lịch',
      dataIndex:'total'
    }
  ]

  const monthColumns = [
    {
      title:'Tháng',
      dataIndex:'month'
    },
    {
      title:'Số lịch',
      dataIndex:'total'
    }
  ]

  const serviceColumns = [
    {
      title:'Dịch vụ',
      dataIndex:'service'
    },
    {
      title:'Doanh thu',
      dataIndex:'revenue'
    }
  ]

  const staffColumns = [
    {
      title:'Nhân viên',
      dataIndex:'staff'
    },
    {
      title:'Doanh thu',
      dataIndex:'revenue'
    }
  ]

  return(

    <div>

      <h2>Thống kê lịch theo ngày</h2>

      <Table
        columns={dateColumns}
        dataSource={getByDate()}
        rowKey="date"
        pagination={false}
      />

      <h2 style={{marginTop:40}}>
        Thống kê lịch theo tháng
      </h2>

      <Table
        columns={monthColumns}
        dataSource={getByMonth()}
        rowKey="month"
        pagination={false}
      />

      <h2 style={{marginTop:40}}>
        Doanh thu theo dịch vụ
      </h2>

      <Table
        columns={serviceColumns}
        dataSource={revenueByService()}
        rowKey="service"
        pagination={false}
      />

      <h2 style={{marginTop:40}}>
        Doanh thu theo nhân viên
      </h2>

      <Table
        columns={staffColumns}
        dataSource={revenueByStaff()}
        rowKey="staff"
        pagination={false}
      />

    </div>

  )

}