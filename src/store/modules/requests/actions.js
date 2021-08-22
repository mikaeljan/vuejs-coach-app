export default {
  async addRequest(context, data) {
    const newRequest = {
      userEmail: data.email,
      message: data.message
    };
    const response = await fetch(
      `https://vuejs-coach-app-fb377-default-rtdb.europe-west1.firebasedatabase.app/requests/${data.coachId}.json`,
      {
        method: 'POST',
        body: JSON.stringify(newRequest)
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to send request');
    }
    newRequest.id = responseData.name;
    newRequest.coachId = data.coachId;

    context.commit('addRequest', newRequest);
  },
  async fetchRequests(context) {
    const coachId = context.rootGetters.userId;
    const token = context.rootGetters.token;
    const response = await fetch(
      `https://vuejs-coach-app-fb377-default-rtdb.europe-west1.firebasedatabase.app/requests/${coachId}.json?auth=${token}`
    );
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to fetch requests');
    }
    const requests = [];
    for (const key in responseData) {
      const request = {
        id: key,
        coachId: coachId,
        userEmail: responseData[key].userEmail,
        message: responseData[key].message
      };
      requests.push(request);
    }
    context.commit('setRequests', requests);
  }
};
