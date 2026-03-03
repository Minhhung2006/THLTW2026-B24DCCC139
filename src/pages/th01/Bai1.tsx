import { useState } from 'react';
import { Card, Typography, InputNumber, Button, Space, Alert } from 'antd';

const { Title } = Typography;

export default function Bai1() {
  const [randomNumber, setRandomNumber] = useState(
    Math.floor(Math.random() * 100) + 1,
  );
  const [guess, setGuess] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [attempts, setAttempts] = useState(10);
  const [gameOver, setGameOver] = useState(false);

  const handleGuess = () => {
    if (guess === null) return;

    if (guess === randomNumber) {
      setMessage('Chúc mừng! Bạn đã đoán đúng!');
      setGameOver(true);
    } else if (guess < randomNumber) {
      setMessage('Bạn đoán quá thấp!');
    } else {
      setMessage('Bạn đoán quá cao!');
    }

    const remain = attempts - 1;
    setAttempts(remain);

    if (remain === 0 && guess !== randomNumber) {
      setMessage(`Bạn đã hết lượt! Số đúng là ${randomNumber}`);
      setGameOver(true);
    }
  };

  const resetGame = () => {
    setRandomNumber(Math.floor(Math.random() * 100) + 1);
    setAttempts(10);
    setMessage('');
    setGameOver(false);
    setGuess(null);
  };

  return (
    <Card style={{ maxWidth: 500, margin: 'auto' }}>
      <Title level={3}>🎯 Trò chơi đoán số</Title>

      <p>Bạn còn <b>{attempts}</b> lượt</p>

      <Space>
        <InputNumber
          min={1}
          max={100}
          value={guess ?? undefined}
          onChange={(value) => setGuess(value)}
        />
        <Button type="primary" onClick={handleGuess} disabled={gameOver}>
          Đoán
        </Button>
        <Button onClick={resetGame}>
          Chơi lại
        </Button>
      </Space>

      {message && (
        <Alert
          style={{ marginTop: 20 }}
          message={message}
          type={gameOver ? 'success' : 'info'}
        />
      )}
    </Card>
  );
}