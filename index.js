// Нужно уточнить что делать, когда подряд много пробелов. Сейчас я их удаляю
const calcSmsQuantity = (text) => {
  const maxLength = 140;
  const words = text.split(' ');
  let currentSMS = '';
  let smsCount = 1;

  for (let i = 0; i < words.length; i++) {
    const currentWord = words[i];
    if(currentWord === '') {
      continue;
    }

    const potentialSMS = currentSMS + (currentSMS ? ' ' : '') + currentWord;
    const suffixLength = smsCount.toString().length + 1;

    if (potentialSMS.length + suffixLength <= maxLength) {
      currentSMS = potentialSMS;
    } else {
      smsCount++;
      currentSMS = currentWord;
    }
  }
debugger
  return smsCount;
};

function splitTextIntoSMS(text) {
  const maxLength = 140;
  const words = text.split(' ');

  if (!text || text.trim() === '') {
    return [];
  }

  if (text.length <= maxLength) {
    return [text];
  }

  const smsArray = [];
  let currentSMS = words[0];
  // Нужен для кейса, когда количество sms переваливает за 10, потому тчо в таком случае изменяется длина суффикса
  const totalSms = calcSmsQuantity(text);

  for (let i = 1; i < words.length; i++) {
    const currentWord = words[i];
    if(currentWord === '') {
      continue;
    }

    const potentialSMS = `${currentSMS} ${currentWord}` ;
    const suffix = ` ${smsArray.length + 1}/${totalSms}`;
    const suffixLength = suffix.length;

    if (potentialSMS.length + suffixLength <= maxLength) {
      currentSMS = potentialSMS;
    } else {
      smsArray.push(currentSMS);
      currentSMS = currentWord;
    }
  }

  if (currentSMS) {
    smsArray.push(currentSMS);
  }

  return smsArray.map((sms, index) => `${sms} ${index + 1}/${smsArray.length}`)
}

// Тесты

function runTests() {
  const testCases = [
    {
      input: "Hello",
      expectedOutput: ["Hello"],
    },
    {
      input: "Hello world",
      expectedOutput: ["Hello world"],
    },
    {
      input: "Lorem ipsum dolor sit amet consectetur             adipiscing elit Nullam eleifend odio at magna pretium suscipit Nam commodo mauris felis ut suscipit velit efficitur eget Sed sit amet posuere risus",
      expectedOutput: [
        "Lorem ipsum dolor sit amet consectetur adipiscing elit Nullam eleifend odio at magna pretium suscipit Nam commodo mauris felis ut 1/2",
        "suscipit velit efficitur eget Sed sit amet posuere risus 2/2",
      ],
    },
    {
      // тут много опробелов в конце
      input: "Lorem ipsum dolor sit amet consectetur adipiscing elit Nullam eleifend odio at magna pretium suscipit Nam commodo mauris felis ut suscipit velit efficitur eget Sed sit amet posuere risus                                                                                                                                                                                                                                ",
      expectedOutput: [
        "Lorem ipsum dolor sit amet consectetur adipiscing elit Nullam eleifend odio at magna pretium suscipit Nam commodo mauris felis ut 1/2",
        "suscipit velit efficitur eget Sed sit amet posuere risus 2/2",
      ],
    },
    {
      input: "Lorem ipsum dolor sit amet consectetur adipiscing elit Nullam eleifend odio at magna pretium suscipit Nam commodo mauris felis ut suscip velit efficitur eget Sed sit amet posuere risus",
      expectedOutput: [
        "Lorem ipsum dolor sit amet consectetur adipiscing elit Nullam eleifend odio at magna pretium suscipit Nam commodo mauris felis ut suscip 1/2",
        "velit efficitur eget Sed sit amet posuere risus 2/2",
      ],
    },
  ];

  for (let i = 0; i < testCases.length; i++) {
    const {input, expectedOutput} = testCases[i];
    const result = splitTextIntoSMS(input);
    console.log(`Test Case ${i + 1}`);
    console.log("Input:", input);
    console.log("Expected Output:", expectedOutput);
    console.log("Actual Output:", result);
    console.log("Test Passed:", arraysAreEqual(result, expectedOutput));
    console.log("SMS quantity:", calcSmsQuantity(input));
    console.log("--------------------------");
  }

}

function arraysAreEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
}

runTests();
