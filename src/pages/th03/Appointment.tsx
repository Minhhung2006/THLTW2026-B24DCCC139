import { useEffect, useState } from 'react'
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  TimePicker,
  message
} from 'antd'

export default function Appointment(){

  const [appointments,setAppointments] = useState<any[]>([])
  const [staffs,setStaffs] = useState<any[]>([])
  const [services,setServices] = useState<any[]>([])

  const [open,setOpen] = useState(false)

  const [form] = Form.useForm()

  useEffect(()=>{

    const a = JSON.parse(localStorage.getItem('appointments') || '[]')
    const s = JSON.parse(localStorage.getItem('staffs') || '[]')
    const sv = JSON.parse(localStorage.getItem('services') || '[]')

    setAppointments(a)
    setStaffs(s)
    setServices(sv)

  },[])

  const save = (values:any)=>{

    const date = values.date.format('YYYY-MM-DD')
    const time = values.time.format('HH:mm')

    const isDuplicate = appointments.some(item =>
      item.staff === values.staff &&
      item.date === date &&
      item.time === time
    )

    if(isDuplicate){
      message.error("Lịch đã bị trùng!")
      return
    }

    const newData = [
      ...appointments,
      {
        id: Date.now(),
        customer: values.customer,
        staff: values.staff,
        service: values.service,
        date,
        time,
        status:'Chờ duyệt'
      }
    ]

    setAppointments(newData)

    localStorage.setItem(
      'appointments',
      JSON.stringify(newData)
    )

    setOpen(false)

    form.resetFields()

  }

  const updateStatus = (id:number,status:string)=>{

    const newList = appointments.map(item =>
      item.id === id ? {...item,status} : item
    )

    setAppointments(newList)

    localStorage.setItem(
      'appointments',
      JSON.stringify(newList)
    )

  }

  const columns = [

    {
      title:'Khách',
      dataIndex:'customer'
    },

    {
      title:'Nhân viên',
      dataIndex:'staff'
    },

    {
      title:'Dịch vụ',
      dataIndex:'service'
    },

    {
      title:'Ngày',
      dataIndex:'date'
    },

    {
      title:'Giờ',
      dataIndex:'time'
    },

    {
      title:'Trạng thái',
      render:(_:any,record:any)=>(
        <Select
          value={record.status}
          style={{width:140}}
          onChange={(value)=>updateStatus(record.id,value)}
        >
          <Select.Option value="Chờ duyệt">
            Chờ duyệt
          </Select.Option>

          <Select.Option value="Xác nhận">
            Xác nhận
          </Select.Option>

          <Select.Option value="Hoàn thành">
            Hoàn thành
          </Select.Option>

          <Select.Option value="Hủy">
            Hủy
          </Select.Option>

        </Select>
      )
    }

  ]

  return(

    <div>

      <Button
        type="primary"
        style={{marginBottom:16}}
        onClick={()=>setOpen(true)}
      >
        Đặt lịch
      </Button>

      <Table
        columns={columns}
        dataSource={appointments}
        rowKey="id"
      />

      <Modal
        title="Đặt lịch hẹn"
        visible={open}
        onCancel={()=>setOpen(false)}
        onOk={()=>form.submit()}
      >

        <Form
          form={form}
          layout="vertical"
          onFinish={save}
        >

          <Form.Item
            label="Tên khách"
            name="customer"
            rules={[{required:true}]}
          >
            <Input/>
          </Form.Item>

          <Form.Item
            label="Nhân viên"
            name="staff"
            rules={[{required:true}]}
          >
            <Select>
              {staffs.map(s=>(
                <Select.Option
                  key={s.id}
                  value={s.name}
                >
                  {s.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Dịch vụ"
            name="service"
            rules={[{required:true}]}
          >
            <Select>
              {services.map(s=>(
                <Select.Option
                  key={s.id}
                  value={s.name}
                >
                  {s.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Ngày"
            name="date"
            rules={[{required:true}]}
          >
            <DatePicker style={{width:'100%'}}/>
          </Form.Item>

          <Form.Item
            label="Giờ"
            name="time"
            rules={[{required:true}]}
          >
            <TimePicker
              format="HH:mm"
              style={{width:'100%'}}
            />
          </Form.Item>

        </Form>

      </Modal>

    </div>

  )

}