import connection from "../database";

interface CreateRecommendation {
  name: string, 
  youtubeLink: string, 
  score: number
}

interface Recommendation extends CreateRecommendation {
  id: number
}

interface RandomSong {  
  minScore: number,
  maxScore: number,
  orderBy: string
}

export async function create(newRecommendation: CreateRecommendation) {
  const {name, youtubeLink, score} = newRecommendation;
  await connection.query(
    `
    INSERT INTO recommendations
    (name, "youtubeLink", score)
    VALUES
    ($1, $2, $3)
  `,
    [name, youtubeLink, score]
  );
}

export async function findById(id: number) {
  const result = await connection.query(
    `
    SELECT * FROM recommendations WHERE id = $1
  `,
    [id]
  );

  const song: Recommendation = result.rows[0];

  return song;
}

export async function incrementScore(id: number, increment: number) {
  return await connection.query(
    `
    UPDATE recommendations SET score = score + $1 WHERE id = $2
  `,
    [increment, id]
  );
}

export async function destroy(id: number) {
  return await connection.query(
    `
    DELETE FROM recommendations WHERE id = $1
  `,
    [id]
  );
}

export async function findRecommendations(findSong: RandomSong) {
  let {minScore, maxScore, orderBy} = findSong;
  if(!maxScore) maxScore = Infinity;
  if(!orderBy) orderBy = "";
  let where = "";
  let params = [minScore];

  if (maxScore === Infinity) {
    where = "score >= $1";
  } else {
    where = "score BETWEEN $1 AND $2";
    params.push(maxScore);
  }

  let query = `SELECT * FROM recommendations WHERE ${where}`;

  if (orderBy) {
    query += ` ORDER BY ${orderBy}`;
  }

  const result = await connection.query(query, params);

  const songList: Recommendation[] = result.rows;

  return songList;
}
