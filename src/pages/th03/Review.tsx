import { useEffect, useState } from 'react'
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Rate,
  message
} from 'antd'

export default function Review(){

  const [appointments,setAppointments] = useState<any[]>([])
  const [reviews,setReviews] = useState<any[]>([])
  const [open,setOpen] = useState(false)
  const [current,setCurrent] = useState<any>(null)

  const [form] = Form.useForm()

  useEffect(()=>{

    const a = JSON.parse(localStorage.getItem('appointments') || '[]')
    const r = JSON.parse(localStorage.getItem('reviews') || '[]')

    setAppointments(a)
    setReviews(r)

  },[])

  const saveReview = (values:any)=>{

    const newData = [
      ...reviews,
      {
        id:Date.now(),
        staff:current.staff,
        customer:current.customer,
        rating:values.rating,
        comment:values.comment,
        reply:''
      }
    ]

    setReviews(newData)

    localStorage.setItem(
      'reviews',
      JSON.stringify(newData)
    )

    setOpen(false)
    form.resetFields()

    message.success("Đánh giá thành công")

  }

  const replyReview = (id:number,reply:string)=>{

    const newList = reviews.map(item =>
      item.id === id ? {...item,reply} : item
    )

    setReviews(newList)

    localStorage.setItem(
      'reviews',
      JSON.stringify(newList)
    )

  }

  const getAverage = (staff:string)=>{

    const list = reviews.filter(r=>r.staff===staff)

    if(list.length===0) return 0

    const total = list.reduce(
      (sum,item)=>sum+item.rating,0
    )

    return (total/list.length).toFixed(1)

  }

  const appointmentColumns = [

    {
      title:'Khách',
      dataIndex:'customer'
    },

    {
      title:'Nhân viên',
      dataIndex:'staff'
    },

    {
      title:'Trạng thái',
      dataIndex:'status'
    },

    {
      title:'Đánh giá',
      render:(_:any,record:any)=>{

        if(record.status !== 'Hoàn thành')
          return 'Chưa hoàn thành'

        return(
          <Button
            type="primary"
            onClick={()=>{

              setCurrent(record)
              setOpen(true)

            }}
          >
            Đánh giá
          </Button>
        )
      }
    }

  ]

  const reviewColumns = [

    {
        title: 'Nhân viên',
        dataIndex: 'staff'
    },

    {
        title: 'Điểm TB',
        render: (_: any, record: any) => getAverage(record.staff)
    },

    {
        title: 'Khách',
        dataIndex: 'customer'
    },

    {
        title: 'Sao',
        render: (_: any, record: any) => (
        <Rate disabled value={record.rating} />
        )
    },

    {
        title: 'Nhận xét',
        dataIndex: 'comment'
    },

    {
        title: 'Phản hồi',
        render: (_: any, record: any) => (
        <Input.Search
            defaultValue={record.reply}
            enterButton="Trả lời"
            onSearch={(value) => replyReview(record.id, value)}
        />
        )
    }

    ]
  return(

    <div>

      <h2>Danh sách lịch hoàn thành</h2>

      <Table
        columns={appointmentColumns}
        dataSource={appointments}
        rowKey="id"
      />

      <h2 style={{marginTop:40}}>
        Đánh giá dịch vụ
      </h2>

      <Table
        columns={reviewColumns}
        dataSource={reviews}
        rowKey="id"
      />

      <Modal
        title="Đánh giá dịch vụ"
        visible={open}
        onCancel={()=>setOpen(false)}
        onOk={()=>form.submit()}
      >

        <Form
          form={form}
          layout="vertical"
          onFinish={saveReview}
        >

          <Form.Item
            label="Số sao"
            name="rating"
            rules={[{required:true}]}
          >
            <Rate/>
          </Form.Item>

          <Form.Item
            label="Nhận xét"
            name="comment"
          >
            <Input.TextArea/>
          </Form.Item>

        </Form>

      </Modal>

    </div>

  )

}