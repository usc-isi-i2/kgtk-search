from sentence_transformers import SentenceTransformer


class ComputeEmbeddings:
    def __init__(self, model_name=None):
        if not model_name:
            self.model_name = 'roberta-large-nli-mean-tokens'
        else:
            self.model_name = model_name

        self.model = SentenceTransformer(self.model_name)

    def get_vectors(self, sentence):
        """
            main function to get the vector representations of the descriptions
        """
        if isinstance(sentence, bytes):
            sentence = sentence.decode("utf-8")
        return self.model.encode([sentence], show_progress_bar=False)
