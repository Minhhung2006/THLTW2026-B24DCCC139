import { useState, useEffect } from 'react';
import { Tabs, Card, Button, Input, Select, Table, message } from 'antd';
const { TabPane } = Tabs;
const { Option } = Select;

export default function Bai2() {

  const [subjects,setSubjects]=useState<any[]>([]);
  const [blocks,setBlocks]=useState<any[]>([]);
  const [questions,setQuestions]=useState<any[]>([]);
  const [exams,setExams]=useState<any[]>([]);

  const [subjectName,setSubjectName]=useState('');
  const [subjectCode,setSubjectCode]=useState('');
  const [credits,setCredits]=useState('');

  const [blockName,setBlockName]=useState('');

  const [qContent,setQContent]=useState('');
  const [qSubject,setQSubject]=useState('');
  const [qLevel,setQLevel]=useState('');
  const [qBlock,setQBlock]=useState('');

  const [searchSubject] = useState('');
  const [searchLevel] = useState('');
  const [searchBlock] = useState('');

  useEffect(()=>{
    setSubjects(JSON.parse(localStorage.getItem('subjects')||'[]'))
    setBlocks(JSON.parse(localStorage.getItem('blocks')||'[]'))
    setQuestions(JSON.parse(localStorage.getItem('questions')||'[]'))
    setExams(JSON.parse(localStorage.getItem('exams')||'[]'))
  },[])

  const saveSubjects=(data:any[])=>{
    setSubjects(data)
    localStorage.setItem('subjects',JSON.stringify(data))
  }

  const saveBlocks=(data:any[])=>{
    setBlocks(data)
    localStorage.setItem('blocks',JSON.stringify(data))
  }

  const saveQuestions=(data:any[])=>{
    setQuestions(data)
    localStorage.setItem('questions',JSON.stringify(data))
  }

  const saveExams=(data:any[])=>{
    setExams(data)
    localStorage.setItem('exams',JSON.stringify(data))
  }

  const addSubject=()=>{
    const newData=[...subjects,{id:Date.now(),code:subjectCode,name:subjectName,credits}]
    saveSubjects(newData)
    setSubjectName('')
    setSubjectCode('')
    setCredits('')
  }

  const addBlock=()=>{
    const newData=[...blocks,{id:Date.now(),name:blockName}]
    saveBlocks(newData)
    setBlockName('')
  }

  const addQuestion=()=>{
    const newData=[...questions,{
      id:Date.now(),
      content:qContent,
      subject:qSubject,
      level:qLevel,
      block:qBlock
    }]
    saveQuestions(newData)
    setQContent('')
  }

  const createExam=(subject:any)=>{
    const easy=questions.filter(q=>q.subject===subject && q.level==='Dễ')
    const medium=questions.filter(q=>q.subject===subject && q.level==='Trung bình')
    const hard=questions.filter(q=>q.subject===subject && q.level==='Khó')

    if(easy.length<1||medium.length<1||hard.length<1){
      message.error('Không đủ câu hỏi để tạo đề')
      return
    }

    const exam=[easy[0],medium[0],hard[0]]

    const newExam=[...exams,{id:Date.now(),subject,questions:exam}]
    saveExams(newExam)
    message.success('Tạo đề thành công')
  }

  const filteredQuestions=questions.filter(q=>{
    return(
      (!searchSubject||q.subject===searchSubject)&&
      (!searchLevel||q.level===searchLevel)&&
      (!searchBlock||q.block===searchBlock)
    )
  })

  return(
    <Card>
      <Tabs defaultActiveKey="1">

        <TabPane tab="Khối kiến thức" key="1">

          <Input
            placeholder="Tên khối"
            value={blockName}
            onChange={e=>setBlockName(e.target.value)}
          />

          <Button type="primary" onClick={addBlock} style={{marginTop:10}}>
            Thêm
          </Button>

          <Table
            dataSource={blocks}
            rowKey="id"
            columns={[{title:'Tên khối',dataIndex:'name'}]}
          />

        </TabPane>

        <TabPane tab="Môn học" key="2">

          <Input placeholder="Mã môn" value={subjectCode} onChange={e=>setSubjectCode(e.target.value)}/>
          <Input placeholder="Tên môn" value={subjectName} onChange={e=>setSubjectName(e.target.value)}/>
          <Input placeholder="Số tín chỉ" value={credits} onChange={e=>setCredits(e.target.value)}/>

          <Button type="primary" onClick={addSubject} style={{marginTop:10}}>
            Thêm môn
          </Button>

          <Table
            dataSource={subjects}
            rowKey="id"
            columns={[
              {title:'Mã môn',dataIndex:'code'},
              {title:'Tên môn',dataIndex:'name'},
              {title:'Tín chỉ',dataIndex:'credits'}
            ]}
          />

        </TabPane>

        <TabPane tab="Câu hỏi" key="3">

          <Input placeholder="Nội dung câu hỏi" value={qContent} onChange={e=>setQContent(e.target.value)}/>

          <Select placeholder="Môn học" style={{width:'100%',marginTop:5}} onChange={setQSubject}>
            {subjects.map(s=><Option key={s.name}>{s.name}</Option>)}
          </Select>

          <Select placeholder="Mức độ" style={{width:'100%',marginTop:5}} onChange={setQLevel}>
            <Option value="Dễ">Dễ</Option>
            <Option value="Trung bình">Trung bình</Option>
            <Option value="Khó">Khó</Option>
            <Option value="Rất khó">Rất khó</Option>
          </Select>

          <Select placeholder="Khối kiến thức" style={{width:'100%',marginTop:5}} onChange={setQBlock}>
            {blocks.map(b=><Option key={b.name}>{b.name}</Option>)}
          </Select>

          <Button type="primary" onClick={addQuestion} style={{marginTop:10}}>
            Thêm câu hỏi
          </Button>

          <Table
            dataSource={filteredQuestions}
            rowKey="id"
            columns={[
              {title:'Câu hỏi',dataIndex:'content'},
              {title:'Môn',dataIndex:'subject'},
              {title:'Mức độ',dataIndex:'level'},
              {title:'Khối',dataIndex:'block'}
            ]}
          />

        </TabPane>

        <TabPane tab="Đề thi" key="4">

          <Select
            placeholder="Chọn môn học"
            style={{width:300}}
            onChange={createExam}
          >
            {subjects.map(s=><Option key={s.name}>{s.name}</Option>)}
          </Select>

          <Table
            dataSource={exams}
            rowKey="id"
            columns={[
              {title:'Môn học',dataIndex:'subject'},
              {
                title:'Số câu',
                render:(r)=>r.questions.length
              }
            ]}
          />

        </TabPane>

      </Tabs>
    </Card>
  )
}