function IsTokenStable(token: string | null): boolean {
  if (!token) {
    return false;
  }
  return token.toUpperCase().includes('USD') || token.toUpperCase() === 'BUCK';
}

export default IsTokenStable;
