import React, { useState } from 'react';
import {
  useContractWrite,
  usePrepareContractWrite,
  useContractRead,
} from 'wagmi';
import AipDropperABI from 'config/abis/airdropper.json';
import { erc20ABI, useAccount } from 'wagmi';
import { AirDropperAddress, TokenAddress } from 'config';
import ApproveToken from './ApproveToken';

import { formatEther } from 'ethers/lib/utils.js';
import { parseEther } from 'ethers/lib/utils.js';
export default function DepositToken() {
  const [amount, setAmount] = useState('0');

  const { address } = useAccount();

  const result = useContractRead({
    abi: erc20ABI,
    address: TokenAddress,
    args: [address, AirDropperAddress],
    functionName: 'allowance',
    account: address,
  });

  const { config } = usePrepareContractWrite({
    address: AirDropperAddress,
    abi: AipDropperABI,
    args: [TokenAddress, parseEther(amount)],
    functionName: 'deposit',
  });

  const { data, isLoading, isSuccess, write } = useContractWrite(config);
  return (
    <div className='w-full flex flex-col justify-center'>
      <div className='flex flex-col gap-2'>
        <div>
          DepositToken :
          <input
            type='number'
            value={amount}
            placeholder='amount'
            className='text-right text-lg'
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        {Number(
          formatEther(result.data) === undefined ? 0 : formatEther(result.data)
        ) > 0 &&
        Number(
          formatEther(result.data) === undefined ? 0 : formatEther(result.data)
        ) > amount ? (
          <div className='flex justify-center flex-col'>
            <button
              className='mx-2 text-white btn_color py-1 px-2 rounded-lg disabled:bg-gray-600'
              disabled={isLoading || !amount}
              onClick={() => write?.()}
            >
              Deposit
            </button>
            <div className='flex'>
              {isLoading && <div>Processing...</div>}
              {isSuccess && <div>Transaction: Successful!</div>}
            </div>
          </div>
        ) : (
          <ApproveToken />
        )}
      </div>
    </div>
  );
}
