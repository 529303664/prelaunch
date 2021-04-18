import React, { useEffect, useState, useMemo } from 'react';
import { Button, Card, Description, Link, Page, Radio, Row, Text, useMediaQuery } from '@geist-ui/react'
import * as Icon from '@geist-ui/react-icons'
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import pAny from 'p-any';

import { combineProofs } from '@apron/merkledrop-lib';

import Web3 from "web3";
import Web3Modal from "web3modal";

import './assets/css/App.css';
import { network, etherscanBase, loadMerkleAirdropContract } from './contracts';


const NETWORK = network;
const IPFS_BASES = [
  'https://10.via0.com/ipfs',
  'https://ipfs.io/ipfs',
  'https://ipfs.leiyun.org/ipfs',
  'https://cloudflare-ipfs.com/ipfs',
];

const providerOptions = {};
const web3Modal = new Web3Modal({
  network: NETWORK, // optional
  cacheProvider: true, // optional
  providerOptions // required
});


function etherscanAccountLink (account) {
  return `${etherscanBase}/address/${account}`;
}

function etherscanTxLink (tx) {
  return `${etherscanBase}/tx/${tx}`;
}

async function agumentedIpfsGet(hash) {
  const promises = IPFS_BASES.map(ipfsBase => axios.get(`${ipfsBase}/${hash}`));
  if (Promise.any) {
    return await Promise.any(promises);
  } else {
    console.warn('No Promise.any, fallback to p-any');
    return await pAny(promises);
  }
}

async function getAirdropPlan(uri) {
  const hash = uri.replace('/ipfs/', '');
  const resp = await agumentedIpfsGet(hash);
  return resp.data;
}

async function getAirdropLists(contract) {
  console.log('### 1');
  const numAirdrop = await contract.methods.airdropsCount().call();

  console.log('Drop number : ', numAirdrop);

  const uriPromises = []
  console.log('### 2');
  for (let i = 1; i <= numAirdrop; i++) {
    uriPromises.push(contract.methods.airdrops(i).call());
  }
  const airdrops = await Promise.all(uriPromises);
  console.log('airdrops', airdrops);
  const plans = await Promise.all(
    airdrops.map(a => getAirdropPlan(a.dataURI))
  );
  const plansWithStatus = plans.map((a, idx) => {
    return {...a, paused: airdrops[idx].paused};
  });

  console.log('plans', plansWithStatus);

  return plansWithStatus;
}

async function checkAwarded(contract, id, address) {
  return await contract.methods.awarded(id, address).call();
}

const AppInner = props => {
  const { t } = useTranslation();
  const isXS = useMediaQuery('xs');
  const width100 = isXS ? {width: '100%'} : {};

  const [provider, setProvider] = useState(null);
  // const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [airdrop, setAirdrop] = useState(null);
  const [plans, setPlans] = useState([]);
  const [total, setTotal] = useState(0);
  const [claimed, setclaimed] = useState(0);
  // notconnected, loading, ready
  const [state, setState] = useState('notconnected');


  async function connectWeb3() {
    setState('notconnected');
    const provider = await web3Modal.connect();
    if (provider) {
      if (provider.on) {
        provider.on("accountsChanged", (acc) => {
          console.log(acc);
          // setAccounts(acc);
        });
        provider.on("chainChanged", (chainId) => {
          console.log(chainId);
        });
        provider.on("connect", (info) => { // : { chainId: number }
          console.log(info);
        });
        provider.on("disconnect", (error) => {  // : { code: number; message: string }
          console.log(error);
        });
      }
      setProvider(provider);
      const web3Instance = new Web3(provider);
      // setWeb3(web3Instance);
      const contract = loadMerkleAirdropContract(web3Instance);
      setAirdrop(contract);
      const acc = await web3Instance.eth.getAccounts();
      setAccounts(acc);
      setState('loading');
      try {
        const planList = await getAirdropLists(contract);
        setPlans(planList);
        setState('ready');
      } catch (err) {
        setState('error');
        setOtherError(`Error: ${err.message}. Please refresh or try with another network connection.`);
        throw err;
      }
    }
  }

  async function disconnectWeb3() {
    if(provider.close) {
      await provider.close();
    }
    web3Modal.clearCachedProvider();
    setProvider(null);
    // setWeb3(null);
    setAccounts([]);
    setAirdrop(null);
    setOtherError('');
    setSentTxError('');
    setShowSentTips(false);
    props.onMouseEnter()
  }

  const [myAwards, setMyAwards] = useState([]);
  async function filterMyAwards() {
    if (accounts.length === 0) {
      console.log('Cannot select my awards')
      return;
    }
    const address = accounts[0];
    if (plans.length === 0) {
      console.log('No plan', plans);
      return;
    }

    const _myAwards = [];
    for (let plan of plans) {
      for (let award of plan.awards) {
        if (award.address.toLowerCase() === address.toLowerCase()) {
          _myAwards.push({
            ...award,
            id: plan.id,
            paused: plan.paused,
          })
        }
      }
    }

    const awarded = await Promise.all(_myAwards.map(a => checkAwarded(airdrop, a.id, a.address)));
    _myAwards.forEach((a, idx) => {
      a.awarded = awarded[idx];
    });

    let total = 0;
    let claimed = 0;
    _myAwards.map(i=>{
       total += parseInt(i.amount)
      if(i.awarded){
        claimed += parseInt(i.amount)
      }

    })
    setTotal(total)
    setclaimed(claimed)

    setMyAwards(_myAwards);
    console.log({myAwards});
  }
  useEffect(() => {
    filterMyAwards();
  }, [accounts, plans])
  useEffect(() => {
    connectWeb3();
  }, [])

  const canClaimAll = useMemo(() => {
    return myAwards.length > 0 && myAwards.reduce((a, x) => a || !x.awarded, false);
  }, [myAwards])

  const [showSending, setShowSending] = useState(false);
  const [showSentTips, setShowSentTips] = useState(false);
  const [selectedAirdrop, setSelectedAirdrop] = useState(-1);
  const [sentTx, setSentTx] = useState('');
  const [sentTxError, setSentTxError] = useState('');
  const [otherError, setOtherError] = useState('');

  function linkForEthAccount () {
    if (accounts.length === 0) {
      return '';
    }
    return etherscanAccountLink(accounts[0]);
  }

  async function claimSingle (id) {
    const [award] = myAwards.filter(a => a.id === id);
    const address = award.address;

    setSentTx('');
    setShowSending(true);
    setShowSentTips(false);
    setSentTxError('');
    try {
      const receipt = await airdrop.methods
        .award(id, address, award.amountWei.toString(), award.proof)
        .send({from: accounts[0]});
      setSentTx(receipt.transactionHash);
      setShowSentTips(true);
    } catch (err) {
      setSentTxError(err.message);
    }
    setShowSending(false);
  }

  async function claimAll () {
    const toClaim = myAwards.filter(a => !a.awarded && !a.paused);
    const address = accounts[0];
    const ids = toClaim.map(a => a.id);
    const amounts = toClaim.map(a => a.amountWei);
    const proofs = toClaim.map(a => a.proof);
    const { combinedProof, proofLengths } = combineProofs(proofs);

    setSentTx('');
    setShowSending(true);
    setShowSentTips(false);
    setSentTxError('');
    try {
      const receipt = await airdrop.methods
        .awardFromMany(ids, address, amounts, combinedProof, proofLengths)
        .send({from: accounts[0]});
      setSentTx(receipt.transactionHash);
      setShowSentTips(true);
    } catch (err) {
      setSentTxError(err.message);
    }
    setShowSending(false);
  }

  async function claim () {
    if (accounts.length === 0) {
      alert('No ETH account found.');
      return;
    }
    if (selectedAirdrop === 0) {
      await claimAll();
    } else {
      await claimSingle(selectedAirdrop);
    }
    filterMyAwards();
  }

  return (
    <div className="App">

      <Page>
        <Page.Header>
          <div className='topFlex'>
            <div>
              <Text h3 style={{marginTop: '15px'}} className='my-name'>Apron Network</Text>
              <div className='main-description'>
                A decentralized platform that provides infrastructure services for DApp developers,DApp users,and operators.A platform that provides infrastructure services for DApp developers,DApp users,and operators.A decentralized platform that provides infrastructure services for DApp developers,DApp users,and operators.
              </div>
            </div>
            <div>
              {!provider && <span onClick={connectWeb3} className='topRht'> <Icon.LogIn />{t('Connect Wallet')}</span>}
              {provider && <span onClick={disconnectWeb3}  className='topRht'><Icon.LogOut />{t('Disconnect Wallet')}</span>}
            </div>
          </div>

        </Page.Header>

        <Page.Content>

          <Radio.Group className='radioGrop' value={selectedAirdrop} onChange={setSelectedAirdrop}>

          {accounts.length >= 1 && (
            <>
              <Row style={{marginBottom: '20px'}}>
                <div className='ethTop'>
                  <Description title={t('ETH Account')} content={accounts[0]} className='text-wrap-all' />

                </div>

              </Row>

              {myAwards.length > 0
              ? (
                <>
                  <Row style={{marginBottom: '5px'}}>
                    <Text span size="0.75rem" style={{fontWeight: 500}} type="secondary">{t('YOUR AWARDS')} (<span>{claimed}</span> claimed / <span>{total}</span> total)</Text>
                  </Row>
                  <Row style={{marginBottom: '20px'}} className='listBrdr'>

                      {myAwards.map(award =>
                              (
                        !award.awarded && !award.paused && <Radio value={award.id} key={award.id} disabled={award.awarded || award.paused}>
                          <span className='text-wrap-all'>
                            #{award.id} - {award.amount} APN {
                            award.awarded ? `(${t('claimed')})` : award.paused ? `(${t('unavailable')})` : ''}
                          </span>
                        </Radio>
                      )

                      )}

                  </Row>
                </>
              )
              : (
                <Row style={{marginBottom: '5px'}}>
                  <Text span size="0.75rem" style={{fontWeight: 500}} type="secondary">
                    {state === 'notconnected'
                      ? t('CONNECTING TO ETHEREUM...')
                      : state === 'loading'
                      ? t('LOADING AWARD LIST...')
                      : state === 'ready'
                      ? t('NO AWARD FOUND')
                      : t('CANNOT LOAD AWARD LIST')
                    }
                  </Text>
                </Row>
              )}

              <section style={{marginTop: '20px', marginBottom: '15px'}}>
                <Row>
                  <Button className='claimBtn'
                    onClick={claim} size='medium' style={width100}
                    loading={showSending} disabled={selectedAirdrop < 0}>
                      {t('Claim')}
                  </Button>
                    <Radio value={0} disabled={!canClaimAll} >
                      <span className='text-wrap-all claimAll'>{t('Claim all')}</span>
                    </Radio>
                </Row>
              </section>

              {showSentTips && (
                <Card type='secondary' className='rhtCard'>
                  <Description title={t('Transaction ID')} content={sentTx
                      ? (<Link href={etherscanTxLink(sentTx)} target='_blank' icon>{sentTx}</Link>)
                      : '(unknown)'
                    } className='text-wrap-all' />
                  <ul>
                    <li>{t('You will receive the token once the transaction gets confirmed')}</li>
                    <li>{t('Please check your')} <Link href={linkForEthAccount()} target='_blank' icon color>{t('Account Page at Etherscan')}</Link></li>
                  </ul>
                </Card>
              )}

              {sentTxError && (
                <Card type='error' className='rhtCard'>
                  <h4>{t('Failed to send transaction')}</h4>
                  <p>{sentTxError}</p>
                </Card>
              )}

              {otherError && (
                <Card type='error' className='rhtCard'>
                  <h4>{t('Error occurred')}</h4>
                  <p>{otherError}</p>
                </Card>
              )}
            </>
          )}
          </Radio.Group>
        </Page.Content>
      </Page>
    </div>
  );
}
export  default AppInner
