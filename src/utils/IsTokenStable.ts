function IsTokenStable(token: string): boolean {
  return token.toLowerCase().includes('usd');
}

export default IsTokenStable;
