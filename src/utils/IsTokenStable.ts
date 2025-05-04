function IsTokenStable(token: string): boolean {
  return token.toUpperCase().includes('USD') || token === 'BUCK';
}

export default IsTokenStable;
