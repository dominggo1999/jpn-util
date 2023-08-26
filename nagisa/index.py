# Just an experiment

import nagisa

text = 'なので、正直雨の中傘をささずに一人途方に暮れたようにしている姿を見かけた時は、何をやっているんだと不審者を見るような眼差しになってしまった。'
words = nagisa.tagging(text)
print(words.words)
