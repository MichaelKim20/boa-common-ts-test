/*******************************************************************************

    Test that create hash.

    Copyright:
        Copyright (c) 2020 BOS Platform Foundation Korea
        All rights reserved.

    License:
        MIT License. See LICENSE for details.

*******************************************************************************/

import * as common from '../lib';

import * as assert from 'assert';

describe('Hash', () => {

    before('Wait for the package libsodium to finish loading', () =>
    {
        return common.SodiumHelper.init();
    });

    // Buffer has the same content. However, when printed with hex strings,
    // the order of output is different.
    // This was treated to be the same as D language.
    it('Test of reading and writing hex string', () => {
        // Read from hex string
        let h = new common.Hash('0x5d7f6a7a30f7ff591c8649f61eb8a35d034824ed5cd252c2c6f10cdbd223671' +
            '3dc369ef2a44b62ba113814a9d819a276ff61582874c9aee9c98efa2aa1f10d73');

        // Check
        assert.strictEqual(h.toString(),
            '0x5d7f6a7a30f7ff591c8649f61eb8a35d034824ed5cd252c2c6f10cdbd2236713d' +
            'c369ef2a44b62ba113814a9d819a276ff61582874c9aee9c98efa2aa1f10d73');
    });

    it('Test of hash("abc")', () => {
        // Hash
        let h = common.hash(Buffer.from("abc"));

        // Check
        assert.strictEqual(h.toString(),
            '0x239900d4ed8623b95a92f1dba88ad31895cc3345ded552c22d79ab2a39c5877' +
            'dd1a2ffdb6fbb124bb7c45a68142f214ce9f6129fb697276a0d4d1c983fa580ba');
    });

    // https://github.com/bpfkorea/agora/blob/v0.x.x/source/agora/common/Hash.d#L260-L265
    it('Test of multi hash', () => {
        // Source 1 : "foo"
        let foo = common.hash(Buffer.from("foo"));

        // Source 2 : "bar"
        let bar = common.hash(Buffer.from("bar"));

        // Hash Multi
        let h = common.hashMulti(foo.data, bar.data);

        // Check
        assert.strictEqual(h.toString(),
            '0xe0343d063b14c52630563ec81b0f91a84ddb05f2cf05a2e4330ddc79bd3a06e57' +
            'c2e756f276c112342ff1d6f1e74d05bdb9bf880abd74a2e512654e12d171a74');
    });

    it('Test of utxo key, using makeUTXOKey', () => {
        let tx_hash = new common.Hash('0x5d7f6a7a30f7ff591c8649f61eb8a35d034824ed5cd252c2c6f10cdbd223671' +
            '3dc369ef2a44b62ba113814a9d819a276ff61582874c9aee9c98efa2aa1f10d73');
        let hash = common.makeUTXOKey(tx_hash, BigInt(1));
        assert.strictEqual(hash.toString(),
            '0x7c95c29b184e47fbd32e58e5abd42c6e22e8bd5a7e934ab049d21df545e09c2' +
            'e33bb2b89df2e59ee01eb2519b1508284b577f66a76d42546b65a6813e592bb84');
    });

    // See_Also: https://github.com/bpfkorea/agora/blob/dac8b3ea6500af68a99c0248c3ade8ab821ee9ef/source/agora/consensus/data/Transaction.d#L203-L229
    it ('Test for hash value of transaction data', () =>
    {
        let payment_tx = new common.Transaction(
            common.TxType.Payment,
            [
                new common.TxInput(common.Hash.init, BigInt(0))
            ],
            [
                common.TxOutput.init
            ],
            common.DataPayload.init
        );

        assert.strictEqual(common.hashFull(payment_tx).toString(),
            "0x35927f79ab7f2c8273f5dc24bb1efa5ebe3ac050fd4fd84d014b51124d0322ed" +
            "709225b92ba28b3ee6b70144d4acafb9a5289fc48ecb4a4f273b537837c78cb0");

        let freeze_tx = new common.Transaction(
            common.TxType.Freeze,
            [
                new common.TxInput(common.Hash.init, BigInt(0))
            ],
            [
                common.TxOutput.init
            ],
            common.DataPayload.init
        );

        assert.strictEqual(common.hashFull(freeze_tx).toString(),
            "0x0277044f0628605485a8f8a999f9a2519231e8c59c1568ef2dac2f241ce569d8" +
            "54e15f950e0fd3d88460309d3e0ef3fbd57b8f5af998f8bacbe391ddb9aea328");
    });
});
