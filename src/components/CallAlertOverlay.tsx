import React from 'react';
import { View, Text, Button, XStack, YStack } from 'tamagui';
import { IconSymbol } from '../../components/ui/IconSymbol'; // Import the IconSymbol component

interface CallAlertOverlayProps {
  callerName: string;
  phoneNumber: string;
  reputation: 'safe' | 'spam' | 'scam' | 'unknown';
  onDismiss: () => void;
  onBlock: () => void;
}

const CallAlertOverlay: React.FC<CallAlertOverlayProps> = ({
  callerName,
  phoneNumber,
  reputation,
  onDismiss,
  onBlock,
}) => {
  let backgroundColor = '$green5';
  let textColor = '$green10';
  let reputationText = 'Unknown';
  let iconName: 'checkmark.circle.fill' | 'exclamationmark.triangle.fill' | 'xmark.octagon.fill' | 'questionmark.circle.fill' = 'questionmark.circle.fill';

  switch (reputation) {
    case 'safe':
      backgroundColor = '$green5';
      textColor = '$green10';
      reputationText = 'Safe Caller';
      iconName = 'checkmark.circle.fill';
      break;
    case 'spam':
      backgroundColor = '$orange5';
      textColor = '$orange10';
      reputationText = 'Potential Spam';
      iconName = 'exclamationmark.triangle.fill';
      break;
    case 'scam':
      backgroundColor = '$red5';
      textColor = '$red10';
      reputationText = 'Likely Scam';
      iconName = 'xmark.octagon.fill';
      break;
    case 'unknown':
    default:
      backgroundColor = '$gray5';
      textColor = '$gray10';
      reputationText = 'Unknown Reputation';
      iconName = 'questionmark.circle.fill';
      break;
  }

  return (
    <YStack
      position="absolute"
      top={50}
      left={20}
      right={20}
      zIndex={1000}
      backgroundColor={backgroundColor}
      padding="$4"
      borderRadius="$4"
      shadowColor="$shadowColor"
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={0.25}
      shadowRadius={3.84}
      elevation={5}
    >
      <XStack alignItems="center" space="$3">
        <IconSymbol name={iconName} size={32} color={textColor} />
        <YStack>
          <Text fontSize="$6" fontWeight="bold" color={textColor}>
            Incoming Call
          </Text>
          <Text fontSize="$5" color={textColor}>
            {callerName || 'Unknown Caller'}
          </Text>
        </YStack>
      </XStack>
      <Text fontSize="$4" color={textColor} marginTop="$2">
        {phoneNumber}
      </Text>
      <Text fontSize="$4" fontWeight="bold" color={textColor} marginTop="$2">
        Reputation: {reputationText}
      </Text>

      <XStack justifyContent="space-around" marginTop="$4">
        <Button onPress={onDismiss} theme="alt1">
          Dismiss
        </Button>
        <Button onPress={onBlock} theme="red">
          Block
        </Button>
      </XStack>
    </YStack>
  );
};

export default CallAlertOverlay;