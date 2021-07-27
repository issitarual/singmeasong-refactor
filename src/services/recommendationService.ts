import getYouTubeID from "get-youtube-id";

import * as recommendationRepository from "../repositories/recommendationRepository";

export async function saveRecommendation(name: string, youtubeLink: string) {
  const youtubeId = getYouTubeID(youtubeLink);

  if (youtubeId === null) {
    return null;
  }

  const score: number = 0;

  const newRecommendation = {
    name,
    youtubeLink,
    score
  }
  return await recommendationRepository.create(newRecommendation);
}

export async function upvoteRecommendation(id: number) {
  return await changeRecommendationScore(id, 1);
}

export async function downvoteRecommendation(id: number) {
  const recommendation = await recommendationRepository.findById(id);
  if (recommendation.score === -5) {
    return await recommendationRepository.destroy(id);
  } else {
    return await changeRecommendationScore(id, -1);
  }
}

export async function getRandomRecommendation() {
  const random = Math.random();

  let recommendations;
  let randomSong: {
    minScore: number,
    maxScore: number,
    orderBy: string
  }
  const orderBy = "RANDOM()";

  if (random > 0.7) {
    randomSong. minScore = -5;
    randomSong.maxScore = 10;
    recommendations = await recommendationRepository.findRecommendations(randomSong);
  } else {
    randomSong. minScore = 11;
    randomSong.maxScore = Infinity;
    recommendations = await recommendationRepository.findRecommendations(randomSong);
  }

  return recommendations[0];
}

async function changeRecommendationScore(id: number, increment: number) {
  const result = await recommendationRepository.incrementScore(id, increment);
  return result.rowCount === 0 ? null : result;
}
