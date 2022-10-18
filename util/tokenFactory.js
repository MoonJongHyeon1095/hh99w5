const jwt = require('jsonwebtoken');


class tokenFactory {

setToken (userId)  {
    let tokenObject = {}; // Refresh Token을 저장할 Object

    const accessToken = this.createAccessToken(userId);
    const refreshToken = this.createRefreshToken();
    
    tokenObject[refreshToken] = userId; // Refresh Token을 가지고 해당 유저의 정보를 서버에 저장합니다.
    //빈 객체에 배열 구조분해할당 한 것. 리프레시 토큰이 key, id가 value??

    res.cookie('accessToken', accessToken); // Access Token을 Cookie에 전달한다.
    res.cookie('refreshToken', refreshToken); // Refresh Token을 Cookie에 전달한다
}  
  
// 10초짜리 Access Token을 생성합니다.
createAccessToken (userId) {
    const accessToken = jwt.sign(
      { userId }, // JWT 데이터
      process.env.SECRET_KEY, // 비밀키
      { expiresIn: '1h' }) // Access Token이 1시간 뒤에 만료되도록 설정합니다.
  
    return accessToken;
  }

// 7일짜리 Refresh Token을 생성합니다. Access Token 을 재발급하기 위한 용도.
createRefreshToken() {
    const refreshToken = jwt.sign(
      {}, // JWT 데이터 //refresh token은 JWT 데이터가 없다!!!!
      process.env.SECRET_KEY, // 비밀키
      { expiresIn: '7d' }) // Refresh Token이 7일 뒤에 만료되도록 설정합니다.
  
    return refreshToken;
  }  


getToken(){
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) return res.status(400).json({ "message": "Refresh Token이 존재하지 않습니다." });
  if (!accessToken) return res.status(400).json({ "message": "Access Token이 존재하지 않습니다." });

  const isAccessTokenValidate = this.validateAccessToken(accessToken);
  const isRefreshTokenValidate = this.validateRefreshToken(refreshToken);

  if (!isRefreshTokenValidate) return res.status(419).json({ "message": "Refresh Token이 만료되었습니다." });

//12번째 줄 참고. tokenObject[refreshToken] = id 임. 토큰이 처음 지정한 id값을 가지고 온다.
//tokenObject  라고 저장한 임의의 저 객체가 나르는 것이 {refreshToken문자열:id}이다. 
//그러니 저렇게 refreshToken값을 넣으면 id값이 튀어나온다.
//그러니까 accessTokenId라고 저장하는 거다.

  if (!isAccessTokenValidate) {
    const accessTokenId = tokenObject[refreshToken]
//그러니까 너가 헷갈린게 이거야. 괜히 access랑 refresh 라고 하니까 뭔가 access가 베이스 같고 refresh가 임시 같잖아.
//그게 아니야. access는 직접 req.params에서 혹은 어떤 방법으로든 유저에게 id 받아다가 10초짜리로 주는 거야.
//10초 안에 로그인 하라 이거지.
//그럼 access 토큰만으로도 로그인에는 문제가 없잖아?
//
//16번째 줄 봐봐. 로그인 할떄마다(set-Token) refreshToken도 같이 주지?
//그리고 48번째 줄 봐봐. get-Token 할때마다 refreshToken도 같이 검사하지?
//걍 둘다 필요한거야. 한꺼번에.
//다만 refreshToken은 저 tokenObject 객체에 key 값으로 집어넣을 7일짜리 열쇠인거야.
//7일짜리도 만료되면 어쩌냐고? 왜 만료됨? 로그인할때마다 set-Token 하는데. 어차피 다 새로 받음 계속.
//7일동안 로그인한 상태로 만료 기다림?
//
//refreshToken이 서버에 인증이 됐다. 비밀키, 만료시간 다 정상. 그런데 왜 acessTokenId가 없나?
//서버에 저 tokenObject 객체에 해당하는 id값이 존재하지 않을 때.
//그러니까 저 객체가 가지고 있는 리스트에 key로 refreshToken의 문자열을 집어넣었는데, value인 id가 없어.
//이게 뭐냐면, AccessToken이나 RefreshToken이 탈취당했다고 해보자.
//RefreshToken은 서버에서 고의적으로 만료시킬 수 있다. (어떻게????)
//혹은 네트워크 저장소에 있는 refreshToken이 유실됐다고 하면(이때는 아예 넣을 key가 없어.)
//혹은 refreshToken을 고의적으로 서버에서 만료시키면(이때는 아예 넣은 key가 없어.)
//이 예외로 넘어온다.
//토큰 자체는 정상적이지만 서버가 가지고 있는 토큰과 일치하지 않는 경우. 
    if (!accessTokenId) return res.status(419).json({ "message": "Refresh Token의 정보가 서버에 존재하지 않습니다." });
    
    //하여튼 사이트 이용중에 refreshToken은 살아있고 aceesToken은 10초짜리니까 만료된 경우야 이게.
    //뭐 10초만에 토큰이 필요한 활동을 못했거나. 여러 이유가 있겠지. 니 카드 조회하는데 통신이 막 30초 걸릴 수도 있잖아.
    //요점은, 이게 새로운 로그인이 아니라는 거야. 예외처리지.
    const newAccessToken = this.createAccessToken(accessTokenId);
    res.cookie('accessToken', newAccessToken);
    return res.json({ "message": "Access Token을 새롭게 발급하였습니다." });
  }
}



// Access Token을 검증합니다.
validateAccessToken(accessToken) {
    try {
      jwt.verify(accessToken, SECRET_KEY); // JWT를 검증합니다.
      return true;
    } catch (error) {
      return false;
    }
  }
  
  //크게 두가지 경우를 거른다. 토큰이랑 시크릿키가 맞지 않을 때, 혹은 토큰이 만료되었을 때.
  // Refresh Token을 검증합니다.
validateRefreshToken(refreshToken) {
    try {
      jwt.verify(refreshToken, SECRET_KEY); // JWT를 검증합니다.
      return true;
    } catch (error) {
      return false;
    }
  }
  
  //결국 이거하려고 한거임. accessToken 을 검증해서 payload에 담아서 보내주려고.
  // Access Token의 Payload를 가져옵니다.
getAccessTokenPayload(accessToken) {
    try {
      const payload = jwt.verify(accessToken, SECRET_KEY); // JWT에서 Payload를 가져옵니다.
      return payload;
    } catch (error) {
      return null;
    }
  }
  


}
module.exports = tokenFactory;