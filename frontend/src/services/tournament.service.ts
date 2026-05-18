import axios from "axios";

const API_URL =
  "http://localhost:3000/api";

// Fake fetch tournament
export const getTournamentById =
  async (id: string) => {
    console.log(
      "Fetch tournament:",
      id
    );

    return {
      id,
      name: "Valorant Champions 2026",
      game: "Valorant",
      status: "ONGOING",
      maxTeams: 16,
      currentTeams: 10,
      prizePool: "50,000,000 VNĐ",
      description:
        "Giải đấu Valorant dành cho các đội tuyển bán chuyên và chuyên nghiệp.",
      banner:
        "https://images.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt0f5b8f7c18d4d5bb/valorant-champions.jpg",
    };

    /*
    REAL API:

    const response = await axios.get(
      `${API_URL}/tournaments/${id}`
    );

    return response.data;
    */
  };

// Fake register
export const registerTournament =
  async (data: any) => {
    console.log(
      "Register tournament:",
      data
    );

    return {
      success: true,
      message:
        "Đăng ký giải đấu thành công",
    };
  };