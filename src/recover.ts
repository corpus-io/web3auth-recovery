import BN from "bn.js";
//var EC = require("elliptic").ec;
import { ec as EC } from "elliptic";
const ecCurve: EC = new EC("secp256k1");

/**
 * This function was taken from https://github.com/tkey/tkey/blob/master/packages/core/src/lagrangeInterpolatePolynomial.ts#L82
 * and adapted
 * @param shares secrets corresponding to the y values of points on the polynomial
 * @param nodeIndex corresponding x values of points on the polynomial
 * @returns evaluation of the polynomial at 0
 */

export function lagrangeInterpolation(shares: BN[], nodeIndex: BN[]): BN {
  if (shares.length !== nodeIndex.length) {
    throw Error(
      "shares not equal to nodeIndex length in lagrangeInterpolation"
    );
  }

  let secret = new BN(0);
  for (let i = 0; i < shares.length; i += 1) {
    let upper = new BN(1);
    let lower = new BN(1);
    for (let j = 0; j < shares.length; j += 1) {
      if (i !== j) {
        upper = upper.mul(nodeIndex[j].neg());
        upper = upper.umod(ecCurve.curve.n);
        let temp = nodeIndex[i].sub(nodeIndex[j]);
        temp = temp.umod(ecCurve.curve.n);
        lower = lower.mul(temp).umod(ecCurve.curve.n);
      }
    }
    let delta = upper.mul(lower.invm(ecCurve.curve.n)).umod(ecCurve.curve.n);
    delta = delta.mul(shares[i]).umod(ecCurve.curve.n);
    secret = secret.add(delta);
  }
  return secret.umod(ecCurve.curve.n);
}
