from docx import Document

# return data json below
# data = {
#     'question1': {'answers': [], 'correct': ''},
#     'question2': {'answers': [], 'correct': ''}
# }
def read_docx(file_path: str):
    try:
        f = open(file_path, 'rb')
        document = Document(f)
        f.close()

        question_count = 0
        data = dict()
        answers = list()
        key = ''
        correct_ans = ''
        for paragraph in document.paragraphs:
            if ('' != paragraph.text):
                if ("Heading 1" == paragraph.style.name):
                    question_count += 1
                    # question_mode = True
                    # print(f'{question_count}. {paragraph.text}')
                    if (key == ''):
                        key = paragraph.text
                    else:
                        data[key] = {'answers': answers, 'correct': correct_ans}
                        # reset
                        key = paragraph.text
                        answers = list()
                        correct_ans = ''
                elif ("Heading 2" == paragraph.style.name):
                    correct_ans = paragraph.text
                    answers.append(paragraph.text)
                else:
                    answers.append(paragraph.text)
        # insert latest question
        data[key] = {'answers': answers, 'correct': correct_ans}
        # verify having errors while reading data
        values = list(data.values())
        error_id_list = list()
        for idx in range(len(values)):
            value = values[idx]
            if (value['correct'] == ''):
                error_id_list.append(idx)
            if (len(value['answers']) != 4):
                error_id_list.append(idx)

        print('total questions: ', question_count)
        print('error ids: ', error_id_list)

        # print data for checking
        # keys = list(data.keys())
        # for idx in error_id_list:
        #     key = keys[idx]
        #     print(key)
        #     print('\n')
        #     print(data[key])
        #     print('============================================================================')

        return data

    except Exception as error:
        print(error)

if '__main__' == __name__:
    read_docx()