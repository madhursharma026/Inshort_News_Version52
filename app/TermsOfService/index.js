import React from "react";
import UseDynamicStyles from "../../context/UseDynamicStyles";
import { View, Text, ScrollView } from "react-native";
import tw from "twrnc"; // Import twrnc for Tailwind CSS classes

const TermsOfService = () => {
  const dynamicStyles = UseDynamicStyles();

  const renderText = (content, style) => (
    <Text
      style={[tw`text-base leading-6 mb-4`, dynamicStyles.textColor, style]}
    >
      {content}
    </Text>
  );

  const renderListItem = (content) => renderText(`• ${content}`, tw`mb-1`);

  return (
    <ScrollView
      style={{ flex: 1 }} // Ensure ScrollView takes full height
      contentContainerStyle={[tw`flex-grow p-4`, dynamicStyles.backgroundColor]} // Use flex-grow
      keyboardShouldPersistTaps="handled" // Ensures taps work when keyboard is up
      contentInsetAdjustmentBehavior="automatic" // Adjusts insets for iOS
    >
      <View>
        {renderText(
          "Terms of Service",
          tw`text-3xl mb-4 font-bold text-center underline`
        )}
        {renderText(
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin tincidunt nunc lorem, eget bibendum nisl malesuada a. Nulla facilisi. Suspendisse potenti. Ut id enim nec ipsum consequat scelerisque. Suspendisse potenti. Phasellus in justo non nisi lacinia efficitur. Donec et sapien in elit vulputate fermentum. Fusce in arcu non nisi blandit placerat."
        )}
        {renderText(
          "Curabitur vel ligula euismod, suscipit augue in, accumsan nisi. Nulla facilisi. In hac habitasse platea dictumst. Curabitur eget tincidunt lorem, id vulputate tortor. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Suspendisse potenti. Phasellus in justo non nisi lacinia efficitur."
        )}

        {renderText(
          "Key Points:",
          tw`text-2xl mb-2 font-bold text-center underline`
        )}
        <View style={tw`ml-4 mb-4`}>
          {[
            "Lorem ipsum dolor sit amet",
            "Consectetur adipiscing elit",
            "Proin tincidunt nunc lorem",
            "Nulla facilisi",
            "Suspendisse potenti",
          ].map(renderListItem)}
        </View>

        {renderText(
          "Curabitur vel ligula euismod, suscipit augue in, accumsan nisi. Nulla facilisi. In hac habitasse platea dictumst. Curabitur eget tincidunt lorem, id vulputate tortor. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Suspendisse potenti. Phasellus in justo non nisi lacinia efficitur."
        )}

        <Text
          style={[tw`text-base text-center mt-4 mb-8`, dynamicStyles.textColor]}
        >
          ---------------------------------------------------
        </Text>
      </View>
    </ScrollView>
  );
};

export default TermsOfService;
