import { useState } from 'react';
import { Card, Button, Space, Table, Tag, Typography } from 'antd';

const { Title } = Typography;

type Choice = 'Kéo' | 'Búa' | 'Bao';

interface History {
  id: number;
  player: Choice;
  computer: Choice;
  result: string;
}

export default function Bai1() {
  const choices: Choice[] = ['Kéo', 'Búa', 'Bao'];

  const [history, setHistory] = useState<History[]>([]);

  const getComputerChoice = (): Choice => {
    const random = Math.floor(Math.random() * 3);
    return choices[random];
  };

  const getResult = (player: Choice, computer: Choice) => {
    if (player === computer) return 'Hòa';

    if (
      (player === 'Kéo' && computer === 'Bao') ||
      (player === 'Búa' && computer === 'Kéo') ||
      (player === 'Bao' && computer === 'Búa')
    ) {
      return 'Thắng';
    }

    return 'Thua';
  };

  const playGame = (playerChoice: Choice) => {
    const computerChoice = getComputerChoice();
    const result = getResult(playerChoice, computerChoice);

    const newGame: History = {
      id: Date.now(),
      player: playerChoice,
      computer: computerChoice,
      result,
    };

    setHistory([newGame, ...history]);
  };

  return (
    <Card>
      <Title level={3}>🎮 Trò chơi Oẳn Tù Tì</Title>

      <Space style={{ marginBottom: 20 }}>
        <Button type="primary" onClick={() => playGame('Kéo')}>
          ✌ Kéo
        </Button>

        <Button type="primary" onClick={() => playGame('Búa')}>
          ✊ Búa
        </Button>

        <Button type="primary" onClick={() => playGame('Bao')}>
          ✋ Bao
        </Button>
      </Space>

      <Table
        rowKey="id"
        dataSource={history}
        columns={[
          {
            title: 'Người chơi',
            dataIndex: 'player',
          },
          {
            title: 'Máy',
            dataIndex: 'computer',
          },
          {
            title: 'Kết quả',
            render: (_, record) => {
              if (record.result === 'Thắng')
                return <Tag color="green">Thắng</Tag>;
              if (record.result === 'Thua')
                return <Tag color="red">Thua</Tag>;
              return <Tag color="blue">Hòa</Tag>;
            },
          },
        ]}
      />
    </Card>
  );
}