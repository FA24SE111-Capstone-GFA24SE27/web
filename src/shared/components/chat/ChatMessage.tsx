import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import { checkFirebaseImageUrl, checkImageUrl, checkLink, formatDateTime } from '@/shared/utils';
import { selectAccount, useAppSelector } from '@shared/store';
import { Typography } from '@mui/material';

function ChatMessage({ message }) {
  const [isImage, setIsImage] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const account = useAppSelector(selectAccount);
  const isFirebaseImageUrl = checkFirebaseImageUrl(message.content)
  useEffect(() => {
    if (isFirebaseImageUrl) {
      return;
    }
    const checkContent = async () => {
      // Check if it's a valid image URL
      const imageResult = await checkImageUrl(message.content);
      setIsImage(imageResult);

      // Check if it's a general link
      setIsLink(checkLink(message.content));
    };

    checkContent();
  }, [message.content]);

  if (!message) {
    return `Error getting message`;
  }

  return (
    <div>
      <Paper
        className={`text-white max-w-384 ${message.sender.id === account.id
          ? 'bg-secondary-main text-white'
          : 'bg-primary-main'
          }`}
      >
        {(isFirebaseImageUrl || isImage) ? (
          <img src={message.content} alt="Message content" className='rounded-lg' />
        ) : isLink ? (
          <Typography className='p-16'>
            <a href={message.content} target="_blank" rel="noopener noreferrer" className="!text-white">
              {message.content}
            </a>
          </Typography>
        ) : (
          <Typography className='p-16'>{message.content}</Typography>
        )}
      </Paper>
      <Typography
        color='textSecondary'
        className={`mt-4 text-sm ${message.sender.id === account.id
          ? 'text-end'
          : 'text-start'
          } `}
      >
        {formatDateTime(message.sentAt)}
      </Typography>
    </div>
  );
}

export default ChatMessage;
