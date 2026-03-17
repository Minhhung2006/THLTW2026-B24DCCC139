import { useEffect, useState } from 'react'
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Space,
  Tabs,
  Popconfirm
} from 'antd'

const { TabPane } = Tabs

export default function StaffService() {

  const [staffs, setStaffs] = useState<any[]>([])
  const [services, setServices] = useState<any[]>([])

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [type, setType] = useState<'staff' | 'service'>('staff')

  const [form] = Form.useForm()

  useEffect(() => {
    const s = JSON.parse(localStorage.getItem('staffs') || '[]')
    const sv = JSON.parse(localStorage.getItem('services') || '[]')

    setStaffs(s)
    setServices(sv)
  }, [])

  const saveStaff = (values:any) => {

    let newData

    if(editing){
      newData = staffs.map(item =>
        item.id === editing.id ? {...editing,...values} : item
      )
    }else{
      newData = [...staffs,{id:Date.now(),...values}]
    }

    setStaffs(newData)
    localStorage.setItem('staffs',JSON.stringify(newData))

    setOpen(false)
    setEditing(null)
    form.resetFields()
  }

  const saveService = (values:any) => {

    let newData

    if(editing){
      newData = services.map(item =>
        item.id === editing.id ? {...editing,...values} : item
      )
    }else{
      newData = [...services,{id:Date.now(),...values}]
    }

    setServices(newData)
    localStorage.setItem('services',JSON.stringify(newData))

    setOpen(false)
    setEditing(null)
    form.resetFields()
  }

  const deleteStaff = (id:number)=>{
    const newData = staffs.filter(item=>item.id!==id)
    setStaffs(newData)
    localStorage.setItem('staffs',JSON.stringify(newData))
  }

  const deleteService = (id:number)=>{
    const newData = services.filter(item=>item.id!==id)
    setServices(newData)
    localStorage.setItem('services',JSON.stringify(newData))
  }

  const staffColumns = [

    {
      title:'Tên nhân viên',
      dataIndex:'name'
    },

    {
      title:'Giới hạn khách/ngày',
      dataIndex:'limit'
    },

    {
      title:'Lịch làm việc',
      dataIndex:'schedule'
    },

    {
      title:'Thao tác',
      render:(_:any,record:any)=>(
        <Space>

          <Button
            onClick={()=>{
              setType('staff')
              setEditing(record)
              form.setFieldsValue(record)
              setOpen(true)
            }}
          >
            Sửa
          </Button>

          <Popconfirm
            title="Xóa nhân viên?"
            onConfirm={()=>deleteStaff(record.id)}
          >
            <Button danger>Xóa</Button>
          </Popconfirm>

        </Space>
      )
    }
  ]

  const serviceColumns = [

    {
      title:'Tên dịch vụ',
      dataIndex:'name'
    },

    {
      title:'Giá',
      dataIndex:'price'
    },

    {
      title:'Thời gian (phút)',
      dataIndex:'duration'
    },

    {
      title:'Thao tác',
      render:(_:any,record:any)=>(
        <Space>

          <Button
            onClick={()=>{
              setType('service')
              setEditing(record)
              form.setFieldsValue(record)
              setOpen(true)
            }}
          >
            Sửa
          </Button>

          <Popconfirm
            title="Xóa dịch vụ?"
            onConfirm={()=>deleteService(record.id)}
          >
            <Button danger>Xóa</Button>
          </Popconfirm>

        </Space>
      )
    }
  ]

  return(

    <div>

      <Tabs defaultActiveKey="1">

        {/* STAFF */}

        <TabPane tab="Nhân viên" key="1">

          <Button
            type="primary"
            style={{marginBottom:16}}
            onClick={()=>{
              setType('staff')
              setEditing(null)
              form.resetFields()
              setOpen(true)
            }}
          >
            Thêm nhân viên
          </Button>

          <Table
            columns={staffColumns}
            dataSource={staffs}
            rowKey="id"
          />

        </TabPane>

        {/* SERVICE */}

        <TabPane tab="Dịch vụ" key="2">

          <Button
            type="primary"
            style={{marginBottom:16}}
            onClick={()=>{
              setType('service')
              setEditing(null)
              form.resetFields()
              setOpen(true)
            }}
          >
            Thêm dịch vụ
          </Button>

          <Table
            columns={serviceColumns}
            dataSource={services}
            rowKey="id"
          />

        </TabPane>

      </Tabs>


      {/* MODAL */}

      <Modal
        title={editing ? "Chỉnh sửa" : "Thêm mới"}
        visible={open}
        onCancel={()=>setOpen(false)}
        onOk={()=>form.submit()}
      >

        <Form
          form={form}
          layout="vertical"
          onFinish={type==='staff'?saveStaff:saveService}
        >

          <Form.Item
            label="Tên"
            name="name"
            rules={[{required:true}]}
          >
            <Input/>
          </Form.Item>

          {type==='staff' && (

            <>
              <Form.Item
                label="Giới hạn khách/ngày"
                name="limit"
                rules={[{required:true}]}
              >
                <InputNumber style={{width:'100%'}}/>
              </Form.Item>

              <Form.Item
                label="Lịch làm việc"
                name="schedule"
              >
                <Input placeholder="VD: 9h - 17h Thứ 6"/>
              </Form.Item>
            </>

          )}

          {type==='service' && (

            <>
              <Form.Item
                label="Giá"
                name="price"
                rules={[{required:true}]}
              >
                <InputNumber style={{width:'100%'}}/>
              </Form.Item>

              <Form.Item
                label="Thời gian thực hiện (phút)"
                name="duration"
                rules={[{required:true}]}
              >
                <InputNumber style={{width:'100%'}}/>
              </Form.Item>
            </>

          )}

        </Form>

      </Modal>

    </div>

  )

}