'use client';

import { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import Button from '../Button';
import { PurchaseRequestTemplate } from './templatePurchaseOrder';
import { DetailPurchaseOrder } from '@/constants/types';
import { api } from '@/constants/api';
import Cookies from "js-cookie";
import { Icon } from '@iconify/react/dist/iconify.js';

interface RequestEvaluationDocumentButtonProps {
    id: string;
}

const PrintButton = ({
    id
}: RequestEvaluationDocumentButtonProps) => {
    const documentRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState<DetailPurchaseOrder>();
    const handlePrint = useReactToPrint({
        content: () => documentRef.current,
        documentTitle: `PURCHASE-REQUEST${new Date().toLocaleDateString()}`,
        bodyClass: 'p-10', // some padding
        onAfterPrint: () => {
            setIsLoading(true);
            setData(undefined);
        }
    });


    const fetchData = async () => {
        try {
            const token = Cookies.get("access_token");
            const response = await fetch(`${api.purchase.detailPurchaseOrder}?id=${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const data = await response.json();
                setData(data.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const [signatureImage1, setSignatureImage1] = useState('');
    const [signatureImage2, setSignatureImage2] = useState('');

    useEffect(() => {
        if (data) {
            const fetchImage = async () => {
                const token = Cookies.get("access_token");
    
                const response = await fetch(api.user.signature + '?file_name=' + data?.header.user_approved_1.signature, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
    
                if (response.ok) {
                    const imageBlob = await response.blob();
                    const imageUrl = URL.createObjectURL(imageBlob)
                    setSignatureImage1(imageUrl)
                } else {
                    console.error('Failed to fetch signature');
                }
            }
    
            const fetchImage2 = async () => {
                const token = Cookies.get("access_token");
    
                const response = await fetch(api.user.signature + '?file_name=' + data?.header.user_approved_2.signature, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
    
                if (response.ok) {
                    const imageBlob = await response.blob();
                    const imageUrl = URL.createObjectURL(imageBlob)
                    setSignatureImage2(imageUrl)
                } else {
                    console.error('Failed to fetch signature');
                }
            }
    
            if (data?.header.user_approved_1) {
                fetchImage();
            }
    
            if (data?.header.user_approved_1) {
                fetchImage2();
            }
        
            setIsLoading(false);
        }
    }, [data])

    useEffect(() => {
        if (!isLoading && handlePrint) {
            handlePrint();
        }
    }, [isLoading, handlePrint]);

    const handleClick = async () => {
        await fetchData();
    };

    return (
        <div>
            <button
                onClick={handleClick}
                className="text-white px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-700"
            >
                <div className="flex items-center gap-2">
                    <Icon icon="mdi:printer" width="24" height="24" />
                </div>
            </button>
            {data && <PurchaseRequestTemplate data={data} ref={documentRef} signatureImage1={signatureImage1} signatureImage2={signatureImage2} />}
        </div>
    );
};

export { PrintButton };