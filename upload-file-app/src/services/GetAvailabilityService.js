import http from "../http-commons";

const getAvailability = (userId) => {
  return http.get("/service/available/" + userId, {
    headers: {
      "Content-type": "application/json",
    },
  });
};

export default { getAvailability };
