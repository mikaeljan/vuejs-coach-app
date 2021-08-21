export default {
  async registerCoach(context, data) {
    const userId = context.rootGetters.userId;
    const coach = {
      id: context.rootGetters.userId,
      firstName: data.first,
      lastName: data.last,
      description: data.desc,
      hourlyRate: data.rate,
      areas: data.areas
    };

    const response = await fetch(
      `https://vuejs-coach-app-fb377-default-rtdb.europe-west1.firebasedatabase.app/coaches/${userId}.json`,
      {
        method: 'PUT',
        body: JSON.stringify(coach)
      }
    );

    if (!response.ok) {
      // error ...
    }

    context.commit('registerCoach', {
      ...coach,
      id: userId
    });
  },
  async loadCoaches(context, payload) {
    if (payload.forceRefresh && !context.rootGetters.shouldUpdate) {
      return;
    }
    const response = await fetch(
      `https://vuejs-coach-app-fb377-default-rtdb.europe-west1.firebasedatabase.app/coaches.json`
    );
    const responseData = await response.json();
    if (!response.ok) {
      const error = new Error(responseData.message || 'Failed to fetch');
      throw error;
    }

    const coaches = [];
    for (const key in responseData) {
      const coach = {
        id: key,
        firstName: responseData[key].firstName,
        lastName: responseData[key].lastName,
        description: responseData[key].description,
        hourlyRate: responseData[key].hourlyRate,
        areas: responseData[key].areas
      };
      coaches.push(coach);
    }
    context.commit('setCoaches', coaches);
    context.commit('setFetchTimestamp');
  }
};
